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

const ProductFormModal: FC<ProductFormModalProps> = ({
  open,
  setOpen,
  type,
  initialProduct,
  categories,
  onSubmit,
}) => {
  const { productFormSchema } = useFormSchema();
  const [tab, setTab] = useState('basic');
  const [isSubmitting, startSubmitting] = useTransition();
  const session = useAppSelector((state) => state.appData.session);
  const isEdit = type === 'EDIT';

  type FormData = z.infer<typeof productFormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: PRODUCT_DEFAULT as FormData,
  });

  useEffect(() => {
    if (!open) {
      form.reset(PRODUCT_DEFAULT);
      setTab('basic');
      return;
    }

    if (isEdit && initialProduct) {
      console.log('initialProduct', initialProduct);
      const currCategory = categories.find((c) => c.name === initialProduct.category.name);
      const formData = {
        ...initialProduct,
        category: currCategory?.name,
        specs: (initialProduct.specs || []).map((spec) => ({ ...spec })),
        variants: (initialProduct.variants || []).map((variant) => ({
          ...variant,
          options: (variant.options || []).map((option) => ({ ...option })),
        })),
      };

      form.reset(formData as FormData);
    } else {
      form.reset(PRODUCT_DEFAULT);
    }
  }, [open, type, initialProduct, form]);

  const updateVariants = (variants: FormData['variants']) => {
    form.setValue('variants', variants || [], { shouldValidate: true });
  };

  const handleFormSubmit = async (values: FormData) => {
    startSubmitting(async () => {
      try {
        const submitData: ProductFormData & { id?: string; sellerId?: string } = {
          ...values,
          name: values.name.trim(),
          categoryId: categories.find((c) => c.name === values.category)?.id,
          basePrice: values.basePrice ?? null,
          stock: values.stock ?? null,
          description: values.description ?? null,

          variants: (values.variants || []).map((variant) => ({
            ...variant,
            options: (variant.options || []).map((option) => ({
              ...option,
              discountedPrice: option.discountedPrice ?? null,
              coupon: option.coupon ?? null,
            })),
          })),
          specs: values.specs || [],
          tags: values.tags || [],
          images: values.images || [],

          brand: values.brand === '' ? null : values.brand?.trim() || null,
          sellerId: session?.user.id,
        };

        if (!submitData.name || !submitData.categoryId) {
          console.error('Missing required fields:', {
            name: submitData.name,
            categoryId: submitData.categoryId,
            type,
            initialProductId: initialProduct?.id,
          });
          toast.error('Missing required fields: name or categoryId');
          return;
        }

        await onSubmit(submitData as ProductFormData, type);
        setOpen(false);
      } catch (err) {
        console.error('Form submission error:', err);
        toast.error(err instanceof Error ? err.message : 'Failed to save product');
      }
    });
  };

  const hasVariants = (form.watch('variants')?.length || 0) > 0;

  return (
    <AlertDialog
      open={open}
      wrapperClassName='sm:max-w-4xl !p-4'
      containerClassName='!pb-0'
      title={!isEdit ? 'Create Product' : 'Edit Product'}
      description={!isEdit ? 'Add a new product to your catalog' : 'Update product information'}
      confirmText={
        isSubmitting
          ? !isEdit
            ? 'Creating...'
            : 'Updating...'
          : !isEdit
            ? 'Create Product'
            : 'Update Product'
      }
      onOpenChange={setOpen}
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
                  type='text'
                  placeholder='0.00'
                  disabled={hasVariants}
                  preventSpaces
                />
                <Input
                  label={`Stock ${hasVariants ? '(Disabled)' : '*'}`}
                  name='stock'
                  type='text'
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
