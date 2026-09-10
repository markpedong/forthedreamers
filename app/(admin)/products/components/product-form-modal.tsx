'use client';

import { FC, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

import AlertDialog from '@/components/reusable/alert-dialog';
import VariantEditor from './variant-editor';
import SpecsEditor from './specs-editor';
import TagsInput from './tags-input';
import ImageUploader from './image-uploader';
import FormField from '@/components/reusable/form-field';
import Select from '@/components/reusable/select';
import { Label } from '@/components/ui/label';

import { PRODUCT_DEFAULT } from '@/constants';
import { ProductFormData, ProductFormModalProps, SchemaForm, TVariant } from '@/lib/types';
import formSchemas from '@/hooks/form-schemas';
import { useUploadProductImagesMutation } from '@/services/useMutation';

const ProductFormModal: FC<ProductFormModalProps> = props => {
  const { open, setOpen, type, initialProduct, categories, onSubmit, isSubmitting = false } = props;

  const { productFormSchema } = formSchemas;
  const [tab, setTab] = useState('basic');
  const isEdit = type === 'EDIT';
  const uploadMutation = useUploadProductImagesMutation();
  const isBusy = isSubmitting || uploadMutation.isPending;

  const form = useForm<SchemaForm<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: PRODUCT_DEFAULT,
  });
  const [images, variants, specs, tags] = useWatch({
    control: form.control,
    name: ['images', 'variants', 'specs', 'tags'],
  });

  const { register, handleSubmit } = form;
  const { errors } = form.formState;

  useEffect(() => {
    if (!open) {
      form.reset(PRODUCT_DEFAULT);
      return;
    }

    if (isEdit && initialProduct) {
      const category = categories.find(c => c.id === initialProduct.category.id);

      form.reset({ ...initialProduct, category: category?.name } as any);
    } else {
      form.reset(PRODUCT_DEFAULT);
    }
  }, [open, type, initialProduct, categories, form, isEdit]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setTab('basic');
    setOpen(nextOpen);
  };

  const handleFormSubmit = (values: SchemaForm<typeof productFormSchema>) => {
    if (values.specs.length === 0) {
      setTab('details');
      toast.error('Please add at least one spec');
      return;
    }

    if (values.tags.length === 0) {
      setTab('details');
      toast.error('Please add at least one tag');
      return;
    }

    if (values.images.length === 0) {
      setTab('basic');
      toast.error('Please add at least one image');
      return;
    }

    const { category, ...rest } = values;
    const currCategory = categories.find(c => c.name === category);
    if (!currCategory) {
      toast.error('Please select a valid category');
      return;
    }

    const data: ProductFormData = {
      ...rest,
      ...(isEdit && { id: initialProduct?.id }),
      categoryId: currCategory.id,
      variants: values.variants.map(({ id, ...variant }) => ({
        ...variant,
        ...(isEdit && id && !id.startsWith('temp-') ? { id } : {}),
      })) as TVariant[],
    };

    onSubmit(data, type);
  };

  const handleInvalid = (errorObj: FieldErrors<SchemaForm<typeof productFormSchema>>) => {
    if (errorObj.variants || errorObj.basePrice || errorObj.stock || errorObj.status) setTab('inventory');
    else if (errorObj.specs || errorObj.tags) setTab('details');
    else setTab('basic');
    toast.error('Please review the highlighted fields');
  };

  return (
    <AlertDialog
      open={open}
      wrapperClassName="sm:max-w-4xl !p-4"
      containerClassName="!pb-0"
      title={isEdit ? 'Edit Product' : 'Create Product'}
      description={isEdit ? 'Update product information' : 'Add a new product to your catalog'}
      confirmText={
        uploadMutation.isPending
          ? 'Uploading images...'
          : isSubmitting
            ? isEdit
              ? 'Updating...'
              : 'Creating...'
            : isEdit
              ? 'Update Product'
              : 'Create Product'
      }
      onOpenChange={handleOpenChange}
      onConfirm={form.handleSubmit(handleFormSubmit, handleInvalid)}
      loading={isBusy}
    >
      <ScrollArea className="max-h-[calc(90vh-180px)] mt-8">
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="inventory">Variants & Stock</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <form className="space-y-6">
            {/* BASIC INFO TAB */}
            <TabsContent value="basic" className="space-y-6">
              <FormField {...register('name')} id="product-name" label="Product Name *" error={errors.name?.message} placeholder="e.g., Premium Wireless Headphones" />
              <FormField {...register('brand')} id="product-brand" label="Brand" error={errors.brand?.message} placeholder="e.g., AudioTech (optional)" />
              <Select
                containerClassName="w-full"
                label="Category *"
                name="category"
                options={categories.map(c => ({ value: c.name, label: c.name }))}
              />
              <FormField {...register('description')} id="product-description" label="Description" error={errors.description?.message} type="textarea" placeholder="Enter product description..." />
              <div>
                <Label>Product Images</Label>
                <div className="mt-1.5">
                  <ImageUploader
                    images={images || []}
                    onImagesChange={imgs => form.setValue('images', imgs, { shouldValidate: true })}
                    onUpload={async files => (await uploadMutation.mutateAsync(files)).data ?? []}
                    isUploading={uploadMutation.isPending}
                    maxImages={5}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="inventory" className="space-y-6">
              <VariantEditor
                variants={(variants || []) as TVariant[]}
                onVariantsChange={updatedVariants => {
                  form.setValue('variants', updatedVariants as TVariant[], { shouldValidate: true });
                  if (updatedVariants.length > 0) {
                    form.clearErrors(['basePrice', 'stock']);
                  } else {
                    form.trigger(['basePrice', 'stock']);
                  }
                }}
              />
              <div className="flex justify-end items-center mb-2 text-xs text-muted-foreground">
                Base price & stock disabled when variants exist
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField {...register('basePrice')} id="product-base-price" label="Base Price" error={errors.basePrice?.message} type="number" placeholder="0.00" />
                <FormField {...register('stock')} id="product-stock" label="Stock" error={errors.stock?.message} type="number" placeholder="0" />
              </div>

              <Select
                containerClassName="w-full"
                label="Status *"
                name="status"
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
              />
            </TabsContent>
            <TabsContent value="details" className="space-y-6">
              <SpecsEditor
                specs={specs || []}
                onSpecsChange={specs => form.setValue('specs', specs, { shouldValidate: true })}
              />

              <div>
                <Label>Tags</Label>
                <div className="mt-1.5">
                  <TagsInput
                    tags={tags || []}
                    onTagsChange={tags => form.setValue('tags', tags, { shouldValidate: true })}
                  />
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </ScrollArea>
    </AlertDialog>
  );
};

export default ProductFormModal;
