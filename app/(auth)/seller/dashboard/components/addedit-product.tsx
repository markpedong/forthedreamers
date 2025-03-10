import { DEFAULT_VARIATION } from '@/constants'
import { AddProductModalProps, TProductItem, TVariationItem } from '@/constants/types'
import { createProduct, updateProduct } from '@/utils/request'
import {
  addToast,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FC, FormEvent, useEffect, useRef, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

const AddEditProduct: FC<AddProductModalProps> = ({ isOpen, onClose, product }) => {
  const [variations, setVariations] = useState<TVariationItem[]>([DEFAULT_VARIATION])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { data: session } = useSession()
  const [initialData, setInitialData] = useState<TProductItem>()

  useEffect(() => {
    if (product) {
      setVariations(product.variations)
      setInitialData(product)
    }
  }, [product])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const invalidVariation = variations.some(
      variation => variation.discountedPrice && variation.discountedPrice > variation.price
    )
    if (invalidVariation) {
      toast.error('Discounted price cannot be greater than original price', { id: 'discount-error', duration: 3000 })
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('name', `${initialData?.name || ''}`)
      formData.append('description', `${initialData?.description || ''}`)
      formData.append('variations', JSON.stringify(variations.filter(v => v.label && v.price > 0)))
      images.forEach(file => formData.append('newImages', file))

      let res
      if (initialData?.id) {
        formData.append('images', JSON.stringify(initialData.images))
        res = await updateProduct(formData, initialData?.id || '')
      } else {
        formData.append('sellerID', session?.user?.id || '')
        res = await createProduct(formData)
      }

      if (res?.success) {
        setInitialData(undefined)
        addToast({ title: 'Success', description: 'Product saved successfully', color: 'success' })
        onClose()
        router.refresh()
      }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 10) return alert('Maximum 10 images allowed')

    setImages([...images, ...files])
    setImagePreviewUrls([...imagePreviewUrls, ...files.map(file => URL.createObjectURL(file))])
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index])
    setImages(images.filter((_, i) => i !== index))
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
  }

  const updateVariation = (index: number, field: keyof TVariationItem, value: string | number) => {
    const updatedVariations = [...variations]
    updatedVariations[index] = { ...updatedVariations[index], [field]: field === 'label' ? value : Number(value) }
    setVariations(updatedVariations)
  }

  const handleChange = (key: keyof TProductItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //@ts-expect-error type error
    setInitialData(prev => ({
      ...(prev ?? {}),
      [key]: e.target.value
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      size="3xl"
      scrollBehavior="outside"
      onClose={() => onClose()}
      onOpenChange={isOpen => {
        if (!isOpen) {
          setVariations([DEFAULT_VARIATION])
          setImages([])
          setImagePreviewUrls([])
          setInitialData(undefined)
        }
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit} ref={formRef}>
          <ModalHeader>{initialData?.id ? 'Edit' : 'Add'} Product</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Product Name"
                placeholder="Enter product name"
                value={initialData?.name}
                onChange={handleChange('name')}
                isRequired
              />
              <Textarea
                label="Description"
                placeholder="Enter product description"
                value={initialData?.description || ''}
                onChange={handleChange('description')}
                isRequired
              />

              {/* Images */}
              <div>
                <p className="text-small font-medium mb-2">Product Images (Max 10)</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {imagePreviewUrls.map((url, index) => (
                    <Card key={index} className="relative group">
                      <CardBody className="p-2">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="flat"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onPress={() => removeImage(index)}
                        >
                          <Icon icon="lucide:x" className="w-4 h-4" />
                        </Button>
                      </CardBody>
                    </Card>
                  ))}
                  {imagePreviewUrls.length < 10 && (
                    <Button variant="flat" className="h-[100px] w-full" onPress={() => fileInputRef.current?.click()}>
                      <Icon icon="lucide:upload" className="w-6 h-6" />
                      <span className="text-tiny">Add Image</span>
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Variations */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-small font-medium">Product Variations</p>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="customButton1"
                    onPress={() => setVariations([...variations, DEFAULT_VARIATION])}
                  >
                    <Icon icon="lucide:plus" className="w-4 h-4" />
                    Add Variation
                  </Button>
                </div>
                {variations.map((variation, index) => (
                  <Card key={index}>
                    <CardBody className="gap-4">
                      <Input
                        label="Variation Name"
                        placeholder="e.g., 16GB RAM, 512GB SSD"
                        value={variation.label}
                        onValueChange={value => updateVariation(index, 'label', value)}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="number"
                          label="Price"
                          placeholder="0.00"
                          value={variation.price.toString()}
                          onValueChange={value => updateVariation(index, 'price', value)}
                        />
                        <Input
                          type="number"
                          label="Discounted Price"
                          placeholder="0.00"
                          value={variation.discountedPrice?.toString() || ''}
                          onValueChange={value => updateVariation(index, 'discountedPrice', value)}
                        />
                        <Input
                          type="number"
                          label="Stock"
                          placeholder="0"
                          value={variation.stock.toString()}
                          onValueChange={value => updateVariation(index, 'stock', value)}
                        />
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button className="customButton1" color="primary" type="submit" isLoading={isPending}>
              {initialData?.id ? 'Update' : 'Add'} Product
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AddEditProduct
