import prisma from '@/db'
import { uploadImageToCloudinary } from '@/utils/cloudinary'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authRes = await isAuthenticated(req)
    if (!authRes.ok) return authRes

    const { id } = await params
    if (!validateUUID(id)) {
      return generateResponse({ error: 'Invalid product id', status: 400 })
    }

    const formData = await req.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const variations = JSON.parse((formData.get('variations') as string) || '[]')
    const images = JSON.parse((formData.get('images') as string) || '[]')
    const imageFiles = formData.getAll('newImages') as File[]
    const uploadedImages = await Promise.all(imageFiles.map(file => uploadImageToCloudinary(file, 'products')))

    await prisma.products.update({
      where: { id },
      data: { name, description, images: [...uploadedImages, ...images] }
    })

    if (variations.length > 0) {
      await prisma.variations.deleteMany({
        where: { productsId: id }
      })
      await prisma.variations.createMany({
        data: variations.map((v: any) => ({
          label: v.label,
          stock: parseInt(v.stock, 10),
          price: v.price,
          discountedPrice: v.discountedPrice || null,
          productsId: id
        }))
      })
    }

    return generateResponse({ message: 'Product updated successfully' })
  } catch (error) {
    return generateResponse({ error, message: 'Server error', status: 500 })
  }
}
