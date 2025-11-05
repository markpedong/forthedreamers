'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import SpecsEditor from './specs-editor';
import VariantEditor from './variant-editor';
import TagsInput from './tags-input';
import ImageUploader from './image-uploader';
import { slugify } from '@/utils/helper';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  product?: any;
  onSuccess?: () => void;
}

const ProductFormModal = ({
  open,
  onOpenChange,
  mode,
  product,
  onSuccess,
}: ProductFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState('basic');
  const [form, setForm] = useState({
    name: '',
    brand: '',
    basePrice: '',
    description: '',
    category: '',
    status: 'ACTIVE',
    stock: '',
    images: [] as string[],
    tags: [] as string[],
    specs: [] as any[],
    variants: [] as any[],
  });

  useEffect(() => {
    if (mode === 'edit' && product) {
      setForm({
        name: product.name || '',
        brand: product.brand || '',
        basePrice: product.basePrice?.toString() || '',
        description: product.description || '',
        category: product.categoryId?.toString() || '',
        status: product.status || 'ACTIVE',
        stock: product.stock?.toString() || '',
        images: product.images || [],
        tags: product.tags || [],
        specs: product.specs || [],
        variants: product.variants || [],
      });
    }
  }, [mode, product]);

  useEffect(() => {
    if (!open)
      setForm({
        name: '',
        brand: '',
        basePrice: '',
        description: '',
        category: '',
        status: 'ACTIVE',
        stock: '',
        images: [],
        tags: [],
        specs: [],
        variants: [],
      });
  }, [open]);

  const hasVariants = form.variants.some((v: any) => v.options?.length);
  const updateField = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        name: form.name,
        slug: slugify(form.name),
        brand: form.brand || undefined,
        basePrice: !hasVariants && form.basePrice ? Number(form.basePrice) : undefined,
        description: form.description,
        images: form.images,
        tags: form.tags,
        status: form.status as 'ACTIVE' | 'INACTIVE' | 'DRAFT',
        stock: !hasVariants && form.stock ? Number(form.stock) : undefined,
        sellerId: 1,
        categoryId: Number(form.category),
        specs: form.specs,
        variants: form.variants,
      };

      // const res =
      //   mode === 'create'
      //     ? await createProduct(data)
      //     : await updateProduct({ ...data, id: product.id });

      // if (res.success) {
      //   toast.success(`Product ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      //   onOpenChange(false);
      //   onSuccess?.();
      // } else {
      //   toast.error(res.error || `Failed to ${mode} product`);
      // }
    } catch {
      toast.error('Unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] p-0'>
        <DialogHeader className='px-6 pt-6 pb-4 border-b'>
          <DialogTitle className='text-2xl'>
            {mode === 'create' ? 'Create Product' : 'Edit Product'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new product to your catalog' : 'Update product information'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[calc(90vh-180px)] px-6 py-4'>
          <Tabs value={tab} onValueChange={setTab} className='space-y-6'>
            <TabsList className='grid grid-cols-3'>
              <TabsTrigger value='basic'>Basic Info</TabsTrigger>
              <TabsTrigger value='inventory'>Variants & Stock</TabsTrigger>
              <TabsTrigger value='details'>Details</TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value='basic' className='space-y-6'>
              <div className='space-y-4'>
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    placeholder='e.g., Premium Wireless Headphones'
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className='mt-1.5'
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Brand</Label>
                    <Input
                      placeholder='e.g., AudioTech'
                      value={form.brand}
                      onChange={(e) => updateField('brand', e.target.value)}
                      className='mt-1.5'
                    />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select value={form.category} onValueChange={(v) => updateField('category', v)}>
                      <SelectTrigger className='mt-1.5'>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1'>Electronics</SelectItem>
                        <SelectItem value='2'>Accessories</SelectItem>
                        <SelectItem value='3'>Software</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    placeholder='Detailed product description'
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className='mt-1.5 min-h-24'
                  />
                </div>
                <div>
                  <Label>Product Images *</Label>
                  <div className='mt-1.5'>
                    <ImageUploader
                      images={form.images}
                      onImagesChange={(imgs) => updateField('images', imgs)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Variants & Stock */}
            <TabsContent value='inventory' className='space-y-6'>
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <Label>Variants</Label>
                  {hasVariants && (
                    <span className='text-xs text-muted-foreground'>
                      Base price & stock disabled when variants exist
                    </span>
                  )}
                </div>
                <VariantEditor
                  variants={form.variants}
                  onVariantsChange={(v) => updateField('variants', v)}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Base Price {hasVariants && '(Disabled)'}</Label>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='0.00'
                    value={form.basePrice}
                    onChange={(e) => updateField('basePrice', e.target.value)}
                    disabled={hasVariants}
                    className='mt-1.5'
                  />
                </div>
                <div>
                  <Label>Stock {hasVariants && '(Disabled)'}</Label>
                  <Input
                    type='number'
                    placeholder='0'
                    value={form.stock}
                    onChange={(e) => updateField('stock', e.target.value)}
                    disabled={hasVariants}
                    className='mt-1.5'
                  />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger className='mt-1.5'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ACTIVE'>Active</SelectItem>
                    <SelectItem value='INACTIVE'>Inactive</SelectItem>
                    <SelectItem value='DRAFT'>Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Details */}
            <TabsContent value='details' className='space-y-6'>
              <div>
                <Label>Specifications</Label>
                <div className='mt-1.5'>
                  <SpecsEditor specs={form.specs} onSpecsChange={(v) => updateField('specs', v)} />
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <div className='mt-1.5'>
                  <TagsInput tags={form.tags} onTagsChange={(v) => updateField('tags', v)} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className='flex justify-end gap-3 px-6 py-4 border-t bg-muted/30'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
                ? 'Create Product'
                : 'Update Product'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
