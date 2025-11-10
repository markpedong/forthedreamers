'use client';

import { FC, useState, useTransition, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
  const [isSubmitting, startTransition] = useTransition();
  const isEdit = type === 'EDIT';

  type FormData = z.infer<typeof productFormSchema>;
  const form = useForm<FormData>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: PRODUCT_DEFAULT,
  });

  useEffect(() => {
    if (!open) {
      form.reset(PRODUCT_DEFAULT);
      setTab('basic');
      return;
    }

    if (isEdit && initialProduct) {
      const category = categories.find((c) => c.id === initialProduct.categoryId);

      form.reset({
        ...initialProduct,
        basePrice: initialProduct?.basePrice?.toString() || null,
        stock: initialProduct?.stock?.toString() || null,
        categoryId: category?.id,
        specs: initialProduct.specs || [],
        variants:
          initialProduct.variants?.map((v) => ({
            ...v,
            options: v.options || [],
          })) || [],
      } as FormData);
    } else {
      form.reset(PRODUCT_DEFAULT);
    }
  }, [open, type, initialProduct, categories, form, isEdit]);

  const hasVariants = (form.watch('variants')?.length || 0) > 0;

  const handleSubmit = (values: FormData) => {
    startTransition(async () => {
      try {
        const currCategory = categories.find((c) => c.id === values.categoryId);
        const data: ProductFormData = {
          ...values,
          name: values.name.trim(),
          description: values.description?.trim() || null,
          brand: values.brand?.trim() || null,
          categoryId: currCategory?.id || '',
          basePrice: values.basePrice,
          stock: values.stock,
          specs: values.specs || [],
          variants:
            values.variants?.map((v) => ({
              ...v,
              options: v.options?.map((o) => ({
                ...o,
                discountedPrice: o.discountedPrice ?? null,
                coupon: o.coupon ?? null,
              })),
            })) || [],
          tags: values.tags || [],
          images: values.images || [],
        };

        await onSubmit(data, type);
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to save product');
      }
    });
  };

  return (
    <AlertDialog
      open={open}
      wrapperClassName='sm:max-w-4xl !p-4'
      containerClassName='!pb-0'
      title={isEdit ? 'Edit Product' : 'Create Product'}
      description={isEdit ? 'Update product information' : 'Add a new product to your catalog'}
      confirmText={
        isSubmitting
          ? isEdit
            ? 'Updating...'
            : 'Creating...'
          : isEdit
            ? 'Update Product'
            : 'Create Product'
      }
      onOpenChange={setOpen}
      onConfirm={form.handleSubmit(handleSubmit)}
      loading={isSubmitting}
    >
      <ScrollArea className='max-h-[calc(90vh-180px)] mt-8'>
        <Tabs value={tab} onValueChange={setTab} className='space-y-6'>
          <TabsList className='grid grid-cols-3'>
            <TabsTrigger value='basic'>Basic Info</TabsTrigger>
            <TabsTrigger value='inventory'>Variants & Stock</TabsTrigger>
            <TabsTrigger value='details'>Details</TabsTrigger>
          </TabsList>

          <Form form={form} customSubmitButton>
            {/* BASIC INFO TAB */}
            <TabsContent value='basic' className='space-y-6'>
              <Input
                label='Product Name *'
                name='name'
                placeholder='e.g., Premium Wireless Headphones'
              />

              <Input label='Brand' name='brand' placeholder='e.g., AudioTech (optional)' />

              <Select
                label='Category *'
                name='categoryId'
                options={categories.map((c) => ({ value: c.id, label: c.id }))}
              />

              <Input
                type='textarea'
                label='Description'
                name='description'
                placeholder='Enter product description...'
              />

              <div>
                <Label>Product Images</Label>
                <div className='mt-1.5'>
                  <ImageUploader
                    images={form.watch('images') || []}
                    onImagesChange={(imgs) =>
                      form.setValue('images', imgs, { shouldValidate: true })
                    }
                    maxImages={5}
                  />
                </div>
              </div>
            </TabsContent>

            {/* VARIANTS TAB */}
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
                variants={form.watch('variants') as FormVariant[]}
                onVariantsChange={(variants) =>
                  form.setValue('variants', variants, { shouldValidate: true })
                }
              />

              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label={`Base Price`}
                  name='basePrice'
                  type='text'
                  placeholder='0.00'
                  preventSpaces
                />
                <Input label={`Stock`} name='stock' type='text' placeholder='0' />
              </div>

              <Select
                label='Status *'
                name='status'
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
                onSpecsChange={(specs) => form.setValue('specs', specs, { shouldValidate: true })}
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
