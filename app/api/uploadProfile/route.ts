import prisma from '@/db'
import { generateResponse } from '@/utils/helpers'
import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'
import authOptions from '../auth/[...nextauth]/options'
import { uploadImageToCloudinary } from '@/lib/server'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.id) {
    return generateResponse({ error: 'User session not found', status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return generateResponse({ error: 'No file uploaded', status: 400 })
  }

  const imageUrl = await uploadImageToCloudinary(file, 'profile')

  await prisma.users.update({
    where: { id: session?.user?.id },
    data: { image: imageUrl }
  })

  return generateResponse({ data: imageUrl, message: 'Image uploaded successfully' })
}
