'use client';

import { FC, useState, useTransition, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import Select from '@/components/reusable/select';
import AlertDialog from '@/components/reusable/alert-dialog';
import VariantEditor from './variant-editor';
import SpecsEditor from './specs-editor';
import TagsInput from './tags-input';
import { Label } from '@/components/ui/label';

import { PRODUCT_DEFAULT } from '@/constants';
import { ProductFormModalProps, SchemaForm, TVariant } from '@/lib/types';
import useFormSchema from '@/hooks/useFormSchema';

const ProductFormModal: FC<ProductFormModalProps> = ({
  open,
  onOpenChange,
  mode,
  initialProduct,
  categories,
  onSubmit,
}) => {
  const { productSchema, extendedSchema } = useFormSchema();
  const [tab, setTab] = useState('basic');
  const [isSubmitting, startSubmitting] = useTransition();
  const form = useForm<SchemaForm<typeof productSchema>>({
    resolver: zodResolver(extendedSchema),
    defaultValues: PRODUCT_DEFAULT,
  });

  // Reset form on open/edit
  useEffect(() => {
    if (mode === 'edit' && initialProduct) {
      form.reset({
        ...PRODUCT_DEFAULT,
        ...initialProduct,
        basePrice: initialProduct.basePrice || 0,
        stock: initialProduct.stock || 0,
        category: initialProduct.category?.name,
      });
    } else {
      form.reset(PRODUCT_DEFAULT);
    }
  }, [mode, initialProduct, form]);

  // Update variants inside the form
  const updateVariants = (variants: TVariant[]) => {
    form.setValue('variants', variants, { shouldValidate: true });
  };

  const handleFormSubmit = (values: SchemaForm<any>) => {
    startSubmitting(async () => {
      try {
        await onSubmit(values, mode); // Send final data to parent
        onOpenChange(false); // Close modal
      } catch (err) {
        console.error(err);
        // Optionally: toast.error('Failed to save product');
      }
    });
  };

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
                {...form.register('name')}
                placeholder='e.g., Premium Wireless Headphones'
              />
              <Input label='Brand' {...form.register('brand')} placeholder='e.g., AudioTech' />
              <Select
                containerClassName='w-[unset]'
                label='Category *'
                name='category'
                options={categories.map((c) => ({ value: c.name, label: c.name }))}
              />
            </TabsContent>

            {/* Inventory */}
            <TabsContent value='inventory' className='space-y-6'>
              <div className='flex justify-between items-center mb-2'>
                <Label>Variants</Label>
                {form.watch('variants')?.length ? (
                  <span className='text-xs text-muted-foreground'>
                    Base price & stock disabled when variants exist
                  </span>
                ) : null}
              </div>
              <VariantEditor
                variants={form.watch('variants') || []}
                onVariantsChange={updateVariants}
              />

              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label={`Base Price ${!!form.watch('variants')?.length ? '(Disabled)' : ''}`}
                  type='number'
                  {...form.register('basePrice', { valueAsNumber: true })}
                  placeholder='0.00'
                  step='0.01'
                  disabled={!!form.watch('variants')?.length}
                />
                <Input
                  label={`Stock ${!!form.watch('variants')?.length ? '(Disabled)' : ''}`}
                  type='number'
                  {...form.register('stock', { valueAsNumber: true })}
                  placeholder='0'
                  disabled={!!form.watch('variants')?.length}
                />
              </div>

              <Select
                containerClassName='w-[unset]'
                label='Status'
                name='status'
                value={form.watch('status')}
                onValueChange={(v) => form.setValue('status', v)}
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                  { label: 'Draft', value: 'DRAFT' },
                ]}
              />
            </TabsContent>

            {/* Details */}
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
