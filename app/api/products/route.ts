import prisma from '@/db'
import { uploadImageToCloudinary } from '@/utils/cloudinary'
import { generateResponse, isAuthenticated } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const isAuthRes = await isAuthenticated(req)
  if (!isAuthRes.ok) return isAuthRes

  const formData = await req.formData()
  const name = formData.get('name') as string
  const description = formData.get('description') as string | null
  const sellerID = formData.get('sellerID') as string
  const variations = JSON.parse((formData.get('variations') as string) || '[]')

  const imageFiles = formData.getAll('images') as File[]
  const uploadedImages = await Promise.all(imageFiles.map(file => uploadImageToCloudinary(file, 'products')))

  const product = await prisma.products.create({
    data: { name, description, images: uploadedImages, sellerID }
  })

  if (variations.length > 0) {
    await prisma.variations.createMany({
      data: variations.map((v: any) => ({
        label: v.label,
        stock: parseInt(v.stock, 10),
        price: v.price,
        discountedPrice: v.discountedPrice || null,
        productsId: product.id
      }))
    })
  }

  return generateResponse({ message: 'Product added successfully' })
}

export async function GET(req: NextRequest) {
  const isAuthRes = await isAuthenticated(req)
  if (!isAuthRes.ok) return isAuthRes

  const products = await prisma.products.findMany({
    include: { variations: true },
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' }
  })

  return generateResponse({ data: products, message: 'Products fetched successfully' })
}
