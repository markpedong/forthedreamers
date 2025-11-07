'use client';

import { useState, useEffect, FC, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Form from '@/components/reusable/form';
import { useForm } from 'react-hook-form';
import useFormSchema from '@/hooks/useFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRODUCT_DEFAULT } from '@/constants';
import { ProductFormModalProps, SchemaForm } from '@/lib/types';
import Input from '@/components/reusable/input';
import Select from '@/components/reusable/select';
import AlertDialog from '@/components/reusable/alert-dialog';
import VariantEditor from './variant-editor';
import SpecsEditor from './specs-editor';
import { Label } from '@/components/ui/label';
import TagsInput from './tags-input';

const ProductFormModal: FC<ProductFormModalProps> = (props) => {
  const { open, onOpenChange, mode, product, categories } = props;

  const { productSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: PRODUCT_DEFAULT,
  });
  const [isSubmitting, startSubmitting] = useTransition();
  const [tab, setTab] = useState('basic');

  useEffect(() => {
    console.log('product', product);
    if (mode === 'edit' && product) {
      //@ts-ignore
      form.reset({
        ...PRODUCT_DEFAULT,
        ...product,
        category: product.category?.name,
      });
    } else if (mode === 'create') {
      form.reset(PRODUCT_DEFAULT);
    }
  }, [mode, product, form]);

  // const updateField = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const onSubmit = (values: SchemaForm<typeof productSchema>) => {
    startSubmitting(async () => {
      console.log('values', values);
    });
    /* This code snippet is handling the form submission process in the `ProductFormModal` component.
    Here's a breakdown of what it does: */
    // setIsSubmitting(true);
    // try {
    //   const data = {
    //     name: form1.name,
    //     slug: slugify(form1.name),
    //     brand: form1.brand || undefined,
    //     basePrice: !hasVariants && form1.basePrice ? Number(form1.basePrice) : undefined,
    //     description: form1.description,
    //     images: form1.images,
    //     tags: form1.tags,
    //     status: form1.status as 'ACTIVE' | 'INACTIVE' | 'DRAFT',
    //     stock: !hasVariants && form1.stock ? Number(form1.stock) : undefined,
    //     sellerId: 1,
    //     categoryId: Number(form1.category),
    //     specs: form1.specs,
    //     variants: form1.variants,
    //   };
    //   // const res =
    //   //   mode === 'create'
    //   //     ? await createProduct(data)
    //   //     : await updateProduct({ ...data, id: product.id });
    //   // if (res.success) {
    //   //   toast.success(`Product ${mode === 'create' ? 'created' : 'updated'} successfully!`);
    //   //   onOpenChange(false);
    //   //   onSuccess?.();
    //   // } else {
    //   //   toast.error(res.error || `Failed to ${mode} product`);
    //   // }
    // } catch {
    //   toast.error('Unexpected error occurred');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <AlertDialog
      open={open}
      // contentClassname='sm:max-w-4xl'
      wrapperClassName='sm:max-w-4xl !p-4'
      containerClassName='!pb-0'
      title={mode === 'create' ? 'Create Product' : 'Edit Product'}
      onOpenChange={onOpenChange}
      onConfirm={form.handleSubmit(onSubmit)}
      loading={isSubmitting}
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
    >
      <ScrollArea className='max-h-[calc(90vh-180px)] mt-8'>
        <Tabs value={tab} onValueChange={setTab} className='space-y-6 '>
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
                placeholder='e.g., Premium Wireless Headphones'
              />
              <Input label='Brand' name='brand' placeholder='e.g., AudioTech' />
              <Select
                containerClassName='w-[unset]'
                label='Category *'
                name='category'
                options={
                  categories.map((c) => ({
                    value: c.name,
                    label: c.name,
                  })) || []
                }
              />
            </TabsContent>
            <TabsContent value='inventory' className='space-y-6'>
              {/* <div className='flex justify-between items-center mb-2'>
                  <Label>Variants</Label>
                  {product?.variants.length && (
                    <span className='text-xs text-muted-foreground'>
                      Base price & stock disabled when variants exist
                    </span>
                  )}
                </div> */}
              <VariantEditor
                variants={product?.variants || []}
                onVariantsChange={() => {}}
                // onVariantsChange={(v) => updateField('variants', v)}
              />
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label={`Base Price ${!!product?.variants && '(Disabled)'}`}
                  type='number'
                  name='basePrice'
                  placeholder='0.00'
                  disabled={!!product?.variants}
                  step='0.01'
                />
                <Input
                  label={`Stock ${!!product?.variants && '(Disabled)'}`}
                  type='number'
                  name='stock'
                  placeholder='0'
                  disabled={!!product?.variants}
                />
              </div>
              <Select
                label='Status'
                name='status'
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                  { label: 'Draft', value: 'DRAFT' },
                ]}
              />
            </TabsContent>
            <TabsContent value='details' className='space-y-6'>
              <SpecsEditor
                specs={product?.specs || []}
                // onSpecsChange={(v) => updateField('specs', v)}
                onSpecsChange={() => {}}
              />
              <div>
                <Label>Tags</Label>
                <div className='mt-1.5'>
                  <TagsInput tags={product?.tags || []} onTagsChange={() => {}} />
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
