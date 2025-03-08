import prisma from '@/db'
import { generateResponse } from '@/utils/helpers'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  const body = await request.json()
  const { firstName, lastName, email, password, username, role } = body
  const hashedPassword = await bcrypt.hash(password, 12)

  const isExist = await prisma?.users.findFirst({
    where: { OR: [{ email }, { username }] }
  })

  if (isExist) throw generateResponse({ error: 'User already exists' })

  const user = await prisma?.users.create({
    data: {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role
    }
  })

  return generateResponse({
    data: { ...user },
    message: 'User created successfully'
  })
}
