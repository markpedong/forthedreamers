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
        where: { productId: id }
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authRes = await isAuthenticated(req)
    if (!authRes.ok) return authRes

    const { id } = await params
    if (!validateUUID(id)) {
      return generateResponse({ error: 'Invalid product id', status: 400 })
    }

    const deletedAt = new Date()

    await prisma.$transaction([
      prisma.products.update({
        where: { id },
        data: { deletedAt }
      }),
      prisma.variations.updateMany({
        where: { productId: id },
        data: { deletedAt }
      }),
      prisma.carts.deleteMany({
        where: { productId: id }
      }),
      prisma.wishlists.deleteMany({
        where: { productId: id }
      })
    ])

    return generateResponse({ message: 'Product deleted successfully' })
  } catch (error) {
    return generateResponse({ error: 'Server error', status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // const authRes = await isAuthenticated(req)
  // if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid product id', status: 400 })
  }

  const product = await prisma.products.findUnique({
    where: { id, deletedAt: null },
    include: {
      variations: true,
      reviews: true,
      seller: {
        omit: {
          email: true,
          username: true,
          phoneNumber: true,
          password: true,
          role: true,
          updatedAt: true,
          deletedAt: true,
          firstName: true,
          lastName: true,
          refreshToken: true,
          birthday: true
        },
        include: {
          _count: {
            select: {
              products: { where: { deletedAt: null } }
            }
          }
        }
      }
    }
  })

  return generateResponse({ data: product, message: 'Product fetched successfully' })
}