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
import { useAppSelector } from '@/redux/store';

const ProductFormModal: FC<ProductFormModalProps> = ({
  open,
  setOpen,
  type,
  initialProduct,
  categories,
  onSubmit,
}) => {
  const session = useAppSelector((state) => state.appData.session);
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
      const category = categories.find((c) => c.id === initialProduct.category.id);

      form.reset({
        ...initialProduct,
        basePrice: initialProduct?.basePrice?.toString() || null,
        stock: initialProduct?.stock?.toString() || null,
        category: category?.name,
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

  const handleSubmit = (values: FormData) => {
    startTransition(async () => {
      try {
        const currCategory = categories.find((c) => c.name === values.category);
        const data: ProductFormData = {
          ...values,
          ...(!isEdit && { sellerId: session?.user.id }),
          name: values.name.trim(),
          description: values.description?.trim() || null,
          brand: values.brand?.trim() || null,
          categoryId: `${currCategory?.id}`,
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
                name='category'
                options={categories.map((c) => ({ value: c.name, label: c.name }))}
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
              <VariantEditor
                variants={form.watch('variants') as FormVariant[]}
                onVariantsChange={(variants) =>
                  form.setValue('variants', variants, { shouldValidate: true })
                }
              />
              <div className='flex justify-end items-center mb-2 text-xs text-muted-foreground'>
                Base price & stock disabled when variants exist
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Base Price'
                  name='basePrice'
                  type='number'
                  placeholder='0.00'
                  maxLength={6}
                />
                <Input label='Stock' name='stock' type='number' placeholder='0' maxLength={6} />
              </div>

              <Select
                containerClassName='w-full'
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
