'use client'

import { FC, useState, useTransition, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Form from '@/components/reusable/form'
import Input from '@/components/reusable/input'
import Select from '@/components/reusable/select'
import AlertDialog from '@/components/reusable/alert-dialog'
import VariantEditor from './variant-editor'
import SpecsEditor from './specs-editor'
import TagsInput from './tags-input'
import ImageUploader from './image-uploader'
import { Label } from '@/components/ui/label'

import { PRODUCT_DEFAULT } from '@/constants'
import { ProductFormData, ProductFormModalProps, SchemaForm, TVariant } from '@/lib/types'
import useFormSchema from '@/hooks/useFormSchema'
import { useAppSelector } from '@/redux/store'

const ProductFormModal: FC<ProductFormModalProps> = props => {
  const {open, setOpen, type, initialProduct, categories, onSubmit} = props

  const session = useAppSelector(state => state.appData.session)
  const {productFormSchema} = useFormSchema()
  const [tab, setTab] = useState('basic')
  const [isSubmitting, startTransition] = useTransition()
  const isEdit = type === 'EDIT'

  const form = useForm<SchemaForm<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: PRODUCT_DEFAULT
  })

  useEffect(() => {
    if (!open) {
      form.reset(PRODUCT_DEFAULT)
      setTab('basic')
      return
    }

    if (isEdit && initialProduct) {
      const category = categories.find(c => c.id === initialProduct.category.id)

      form.reset({...initialProduct, category: category?.name} as any)
    } else {
      form.reset(PRODUCT_DEFAULT)
    }
  }, [open, type, initialProduct, categories, form, isEdit])

  const handleSubmit = (values: SchemaForm<typeof productFormSchema>) => {
    if (values.specs.length === 0) {
      toast.error('Please add at least one spec')
      return
    }

    if (values.tags.length === 0) {
      toast.error('Please add at least one tag')
      return
    }

    if (values.images.length === 0) {
      toast.error('Please add at least one image')
      return
    }

    startTransition(async () => {
      try {
        const currCategory = categories.find(c => c.name === values.category)
        const { category, ...rest } = values
        const data: ProductFormData = {
          ...rest,
          ...(!isEdit && {sellerId: session?.user.id}),
          categoryId: `${currCategory?.id}`,
          variants: values?.variants.map(({id, ...v}) => v) as TVariant[], 
        }

        await onSubmit(data, type)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to save product')
      }
    })
  }

  return (
    <AlertDialog
      open={open}
      wrapperClassName='sm:max-w-4xl !p-4'
      containerClassName='!pb-0'
      title={isEdit ? 'Edit Product' : 'Create Product'}
      description={isEdit ? 'Update product information' : 'Add a new product to your catalog'}
      confirmText={isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update Product' : 'Create Product'}
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
              <Input label='Product Name *' name='name' placeholder='e.g., Premium Wireless Headphones' preventSpaces />
              <Input label='Brand' name='brand' placeholder='e.g., AudioTech (optional)' preventSpaces />
              <Select
                containerClassName='w-full'
                label='Category *'
                name='category'
                options={categories.map(c => ({value: c.name, label: c.name}))}
              />
              <Input type='textarea' label='Description' name='description' placeholder='Enter product description...' />
              <div>
                <Label>Product Images</Label>
                <div className='mt-1.5'>
                  <ImageUploader
                    images={form.watch('images') || []}
                    onImagesChange={imgs => form.setValue('images', imgs, {shouldValidate: true})}
                    maxImages={5}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value='inventory' className='space-y-6'>
              <VariantEditor
                variants={form.watch('variants') as TVariant[]}
                onVariantsChange={(variants: any) => {
                  console.log("variants", variants)
                  form.setValue('variants', variants, {shouldValidate: true})
                  if (variants.length > 0) {
                    form.clearErrors(['basePrice', 'stock'])
                  } else {
                    form.trigger(['basePrice', 'stock'])
                  }
                }}
              />
              <div className='flex justify-end items-center mb-2 text-xs text-muted-foreground'>
                Base price & stock disabled when variants exist
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <Input label='Base Price' name='basePrice' type='number' placeholder='0.00' maxLength={6} />
                <Input label='Stock' name='stock' type='number' placeholder='0' maxLength={6} />
              </div>

              <Select
                containerClassName='w-full'
                label='Status *'
                name='status'
                options={[
                  {label: 'Active', value: 'ACTIVE'},
                  {label: 'Inactive', value: 'INACTIVE'}
                ]}
              />
            </TabsContent>
            <TabsContent value='details' className='space-y-6'>
              <SpecsEditor
                specs={form.watch('specs') || []}
                onSpecsChange={specs => form.setValue('specs', specs, {shouldValidate: true})}
              />

              <div>
                <Label>Tags</Label>
                <div className='mt-1.5'>
                  <TagsInput tags={form.watch('tags') || []} onTagsChange={tags => form.setValue('tags', tags, {shouldValidate: true})} />
                </div>
              </div>
            </TabsContent>
          </Form>
        </Tabs>
      </ScrollArea>
    </AlertDialog>
  )
}

export default ProductFormModal
