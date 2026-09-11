'use client';

import { FC, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
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
  const hasVariants = (variants?.length ?? 0) > 0;

  const switchVariantMode = (useVariants: boolean) => {
    if (useVariants) {
      form.setValue('variants', [
        {
          id: `temp-${Date.now()}`,
          name: '',
          price: form.getValues('basePrice') ?? 0,
          stock: form.getValues('stock') ?? 0,
          discountedPrice: null,
          coupon: null,
          image: null,
          attributes: {},
        },
      ] as TVariant[]);
    } else {
      const first = variants?.[0];
      if (first) {
        if (first.price != null) form.setValue('basePrice', first.price);
        if (first.stock != null) form.setValue('stock', first.stock);
      }
      form.setValue('variants', []);
    }
    form.clearErrors();
  };

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

  const handleSubmit = (values: SchemaForm<typeof productFormSchema>) => {
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

    const { category, ...rest } = values;
    const currCategory = categories.find(c => c.name === category);
    if (!currCategory) {
      toast.error('Please select a valid category');
      return;
    }

    const data: ProductFormData = {
      ...rest,
      ...(isEdit && { id: initialProduct?.id }),
      status: isEdit && initialProduct ? initialProduct.status : values.status,
      // sold as variants → base price/stock are unused, don't store stale values
      ...(values.variants.length > 0 && { basePrice: null, stock: null }),
      categoryId: currCategory.id,
      variants: values.variants.map(({ id, ...variant }) => ({
        ...variant,
        ...(isEdit && id && !id.startsWith('temp-') ? { id } : {}),
      })) as TVariant[],
    };

    onSubmit(data, type);
  };

  const handleInvalid = (errors: FieldErrors<SchemaForm<typeof productFormSchema>>) => {
    if (errors.images) setTab('basic');
    else if (errors.variants || errors.basePrice || errors.stock) setTab('inventory');
    else if (errors.specs || errors.tags) setTab('details');
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
      onConfirm={form.handleSubmit(handleSubmit, handleInvalid)}
      loading={isBusy}
    >
      <ScrollArea className="max-h-[calc(90vh-180px)] mt-8">
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="inventory">Variants & Stock</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <Form form={form} customSubmitButton>
            {/* BASIC INFO TAB */}
            <TabsContent value="basic" className="space-y-6">
              <Input label="Product Name *" name="name" placeholder="e.g., Premium Wireless Headphones" />
              <Input label="Brand" name="brand" placeholder="e.g., AudioTech (optional)" />
              <Select
                containerClassName="w-full"
                label="Category *"
                name="category"
                options={categories.map(c => ({ value: c.name, label: c.name }))}
              />
              <Input
                type="textarea"
                label="Description"
                name="description"
                placeholder="Enter product description..."
              />
              <div>
                <Label>Product Images *</Label>
                <div className="mt-1.5">
                  <ImageUploader
                    images={images || []}
                    onImagesChange={imgs => form.setValue('images', imgs, { shouldValidate: true })}
                    onUpload={async files => (await uploadMutation.mutateAsync(files)).data ?? []}
                    isUploading={uploadMutation.isPending}
                    maxImages={5}
                  />
                </div>
                {form.formState.errors.images?.message && (
                  <p className="mt-1.5 text-sm text-destructive">{form.formState.errors.images.message}</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="inventory" className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">How is this product sold?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { value: false, title: 'No variants', hint: 'One price and stock for the whole product' },
                    { value: true, title: 'Has variants', hint: 'Separate price and stock per option' },
                  ].map(option => (
                    <label
                      key={option.title}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-checked:border-primary has-checked:bg-primary/5"
                    >
                      <input
                        type="radio"
                        name="variantMode"
                        className="mt-0.5 size-4 accent-primary"
                        checked={hasVariants === option.value}
                        onChange={() => switchVariantMode(option.value)}
                      />
                      <span className="text-sm">
                        <span className="block font-medium">{option.title}</span>
                        <span className="text-muted-foreground">{option.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {hasVariants ? (
                <VariantEditor
                  variants={(variants || []) as TVariant[]}
                  onUpload={async files => (await uploadMutation.mutateAsync(files)).data ?? []}
                  isUploading={uploadMutation.isPending}
                  errors={form.formState.errors.variants as any}
                  onVariantsChange={updatedVariants => {
                    form.setValue('variants', updatedVariants as TVariant[]);
                    // re-validate only after a submit attempt, so a fresh empty variant stays quiet
                    if (form.formState.isSubmitted) form.trigger('variants');
                  }}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Base Price" name="basePrice" type="number" placeholder="0.00" maxLength={6} />
                  <Input label="Stock" name="stock" type="number" placeholder="0" maxLength={6} />
                </div>
              )}
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
          </Form>
        </Tabs>
      </ScrollArea>
    </AlertDialog>
  );
};

export default ProductFormModal;
