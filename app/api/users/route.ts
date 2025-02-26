import prisma from '@/db'
import { generateResponse } from '@/utils/helpers'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  const body = await request.json()

  const { name, email, password, username } = body
  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    const isExist = await prisma?.users.findFirst({
      where: { OR: [{ email }, { username }] }
    })

    if (isExist) throw new Error('User already exists')

    const user = await prisma?.users.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword
      }
    })

    return generateResponse({
      data: { ...user },
      message: 'User created successfully'
    })
  } catch (error) {
    return generateResponse({
      error,
      status: 500,
      message: error instanceof Error ? error.message : 'Error creating user'
    })
  }
}
