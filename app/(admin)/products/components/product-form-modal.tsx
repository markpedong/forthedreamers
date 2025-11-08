'use client';

import { FC, useState, useTransition, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import Select from '@/components/reusable/select';
import AlertDialog from '@/components/reusable/alert-dialog';
import VariantEditor from './variant-editor';
import SpecsEditor from './specs-editor';
import TagsInput from './tags-input';
import ImageUploader from './image-uploader';
import { Label } from '@/components/ui/label';

import { PRODUCT_DEFAULT } from '@/constants';
import { ProductFormModalProps, ProductFormData, FormVariant } from '@/lib/types';
import useFormSchema from '@/hooks/useFormSchema';
import type { z } from 'zod';
import { useAppSelector } from '@/redux/store';

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const ProductFormModal: FC<ProductFormModalProps> = ({
  open,
  onOpenChange,
  mode,
  initialProduct,
  categories,
  onSubmit,
}) => {
  const { productFormSchema, extendedSchema } = useFormSchema();
  const [tab, setTab] = useState('basic');
  const [isSubmitting, startSubmitting] = useTransition();
  const session = useAppSelector((state) => state.appData.session);

  type FormData = z.infer<typeof extendedSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(extendedSchema) as any, // Type assertion needed due to complex schema inference
    defaultValues: PRODUCT_DEFAULT as FormData,
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      // Reset when modal closes
      form.reset(PRODUCT_DEFAULT);
      setTab('basic');
      return;
    }

    if (mode === 'edit' && initialProduct) {
      // Prefill form with existing product data
      const categoryName =
        typeof initialProduct.category === 'string'
          ? initialProduct.category
          : initialProduct.category?.name || '';

      // Find category to get categoryId - prioritize categoryId from product, then from category object, then from categories list
      let categoryId: string | undefined = initialProduct.categoryId;
      if (!categoryId && typeof initialProduct.category === 'object' && initialProduct.category) {
        categoryId = initialProduct.category.id;
      }
      if (!categoryId && categoryName) {
        const category = categories.find((c) => c.name === categoryName);
        categoryId = category?.id;
      }

      const formData = {
        id: initialProduct.id,
        name: initialProduct.name || '',
        slug: initialProduct.slug || generateSlug(initialProduct.name || ''),
        brand: initialProduct.brand || null,
        basePrice: initialProduct.basePrice ?? null,
        description: initialProduct.description || '',
        images: initialProduct.images || [],
        tags: initialProduct.tags || [],
        stock: initialProduct.stock ?? null,
        status: initialProduct.status || 'DRAFT',
        category: categoryName,
        categoryId: categoryId || undefined,
        specs: (initialProduct.specs || []).map((spec) => ({
          id: spec.id,
          label: spec.label,
          value: spec.value,
        })),
        variants: (initialProduct.variants || []).map((variant) => ({
          id: variant.id,
          name: variant.name,
          isRequired: variant.isRequired,
          options: (variant.options || []).map((option) => ({
            id: option.id,
            variantOptionName: option.variantOptionName,
            price: option.price,
            discountedPrice: option.discountedPrice ?? null,
            stock: option.stock,
            coupon: option.coupon ?? null,
          })),
        })),
      };

      form.reset(formData);
    } else {
      // Reset to defaults for create mode
      form.reset(PRODUCT_DEFAULT);
    }
  }, [open, mode, initialProduct, form]);

  // Generate slug from product name (only in create mode or if slug is empty)
  const productName = form.watch('name');
  useEffect(() => {
    if (mode === 'create' && productName) {
      const slug = generateSlug(productName);
      form.setValue('slug', slug, { shouldValidate: false });
    }
  }, [productName, mode, form]);

  // Update variants inside the form
  const updateVariants = (variants: FormData['variants']) => {
    form.setValue('variants', variants || [], { shouldValidate: true });
  };

  // Watch category changes to set categoryId
  const selectedCategory = form.watch('category');
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((c) => c.name === selectedCategory);
      if (category) {
        form.setValue('categoryId', category.id, { shouldValidate: false });
      }
    }
  }, [selectedCategory, categories, form]);

  const handleFormSubmit = async (values: FormData) => {
    startSubmitting(async () => {
      try {
        // Validate required fields
        if (!values.name || !values.name.trim()) {
          toast.error('Product name is required');
          return;
        }

        // Resolve categoryId if not already set
        const categoryName = values.category;
        if (!categoryName || !categoryName.trim()) {
          toast.error('Please select a category');
          return;
        }

        const category = categories.find((c) => c.name === categoryName);

        if (!category) {
          toast.error('Please select a valid category');
          return;
        }

        let finalCategoryId = categories.find((c) => c.name === categoryName)?.id;
        if (!finalCategoryId) {
          toast.error('Unable to resolve category ID. Please select a category.');
          return;
        }

        // Handle slug - in edit mode, preserve existing slug; in create mode, generate from name
        let finalSlug = values.slug;
        if (mode === 'create') {
          finalSlug = finalSlug || generateSlug(values.name);
        } else {
          // In edit mode, use existing slug or generate from name if somehow missing
          finalSlug = finalSlug || initialProduct?.slug || generateSlug(values.name);
        }

        if (!finalSlug || !finalSlug.trim()) {
          toast.error('Slug is required');
          return;
        }

        // Prepare data for submission - ensure all required fields are present and non-empty
        const submitData: ProductFormData & { id?: string; sellerId?: string } = {
          ...values,
          name: values.name.trim(),
          slug: finalSlug.trim(),
          categoryId: finalCategoryId, // Ensure categoryId is always a string
          basePrice: values.basePrice ?? null, // Convert undefined to null
          stock: values.stock ?? null, // Convert undefined to null
          description: values.description ?? null, // Convert undefined to null
          // Ensure arrays are not undefined and normalize data
          variants: (values.variants || []).map((variant) => ({
            ...variant,
            options: (variant.options || []).map((option) => ({
              ...option,
              discountedPrice: option.discountedPrice ?? null, // Convert undefined to null
              coupon: option.coupon ?? null, // Convert undefined to null
            })),
          })),
          specs: values.specs || [],
          tags: values.tags || [],
          images: values.images || [],
          // Handle brand - convert empty string to null
          brand: values.brand === '' ? null : values.brand?.trim() || null,
          sellerId: session?.user.id
        };

        // Final validation before submission
        if (!submitData.name || !submitData.slug || !submitData.categoryId) {
          console.error('Missing required fields:', {
            name: submitData.name,
            slug: submitData.slug,
            categoryId: submitData.categoryId,
            mode,
            initialProductId: initialProduct?.id,
          });
          toast.error('Missing required fields: name, slug, or categoryId');
          return;
        }

        await onSubmit(submitData as ProductFormData, mode);
        onOpenChange(false);
      } catch (err) {
        console.error('Form submission error:', err);
        toast.error(err instanceof Error ? err.message : 'Failed to save product');
      }
    });
  };

  // Watch form values for conditional rendering
  const hasVariants = (form.watch('variants')?.length || 0) > 0;

  return (
    <AlertDialog
      open={open}
      wrapperClassName='sm:max-w-4xl !p-4'
      containerClassName='!pb-0'
      title={mode === 'create' ? 'Create Product' : 'Edit Product'}
      description={
        mode === 'create' ? 'Add a new product to your catalog' : 'Update product information'
      }
      confirmText={
        isSubmitting
          ? mode === 'create'
            ? 'Creating...'
            : 'Updating...'
          : mode === 'create'
            ? 'Create Product'
            : 'Update Product'
      }
      onOpenChange={onOpenChange}
      onConfirm={form.handleSubmit(handleFormSubmit)}
      loading={isSubmitting}
    >
      <ScrollArea className='max-h-[calc(90vh-180px)] mt-8'>
        <Tabs value={tab} onValueChange={setTab} className='space-y-6'>
          <TabsList className='grid grid-cols-3 !w-[unset]'>
            <TabsTrigger value='basic'>Basic Info</TabsTrigger>
            <TabsTrigger value='inventory'>Variants & Stock</TabsTrigger>
            <TabsTrigger value='details'>Details</TabsTrigger>
          </TabsList>

          <Form form={form} customSubmitButton>
            {/* Basic Info */}
            <TabsContent value='basic' className='space-y-6'>
              <Input
                label='Product Name *'
                name='name'
                control={form.control}
                placeholder='e.g., Premium Wireless Headphones'
              />

              <Input
                label='Brand'
                name='brand'
                control={form.control}
                placeholder='e.g., AudioTech (optional)'
              />

              <Select
                containerClassName='w-[unset]'
                label='Category *'
                name='category'
                control={form.control}
                options={categories.map((c) => ({ value: c.name, label: c.name }))}
              />

              <Input
                type='textarea'
                label='Description'
                name='description'
                control={form.control}
                textarea
                placeholder='Enter product description...'
              />

              <div>
                <Label>Product Images</Label>
                <div className='mt-1.5'>
                  <ImageUploader
                    images={form.watch('images') || []}
                    onImagesChange={(images) =>
                      form.setValue('images', images, { shouldValidate: true })
                    }
                    maxImages={5}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Inventory */}
            <TabsContent value='inventory' className='space-y-6'>
              <div className='flex justify-between items-center mb-2'>
                <Label>Variants</Label>
                {hasVariants && (
                  <span className='text-xs text-muted-foreground'>
                    Base price & stock disabled when variants exist
                  </span>
                )}
              </div>

              <VariantEditor
                variants={(form.watch('variants') || []) as FormVariant[]}
                onVariantsChange={updateVariants as (variants: FormVariant[]) => void}
              />

              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label={`Base Price ${hasVariants ? '(Disabled)' : '*'}`}
                  name='basePrice'
                  type='number'
                  control={form.control}
                  placeholder='0.00'
                  disabled={hasVariants}
                />
                <Input
                  label={`Stock ${hasVariants ? '(Disabled)' : '*'}`}
                  name='stock'
                  type='number'
                  control={form.control}
                  placeholder='0'
                  disabled={hasVariants}
                />
              </div>

              <Select
                containerClassName='w-[unset]'
                label='Status *'
                name='status'
                control={form.control}
                options={[
                  { label: 'Draft', value: 'DRAFT' },
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
              />
            </TabsContent>

            {/* Details */}
            <TabsContent value='details' className='space-y-6'>
              <SpecsEditor
                specs={form.watch('specs') || []}
                onSpecsChange={(specs) => {
                  form.setValue(
                    'specs',
                    specs as Array<{
                      id?: string;
                      label: string;
                      value: string;
                    }>,
                    { shouldValidate: true },
                  );
                }}
              />

              <div>
                <Label>Tags</Label>
                <div className='mt-1.5'>
                  <TagsInput
                    tags={form.watch('tags') || []}
                    onTagsChange={(tags) => form.setValue('tags', tags, { shouldValidate: true })}
                  />
                </div>
              </div>
            </TabsContent>
          </Form>
        </Tabs>
      </ScrollArea>
    </AlertDialog>
  );
};

export default ProductFormModal;
