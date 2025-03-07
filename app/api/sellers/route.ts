import prisma from "@/db";
import { generateResponse } from "@/utils/helpers";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phoneNumber, password } = body

  const hashedPassword = await bcrypt.hash(password, 12)


  await prisma.sellers.create({
    data: {
      name,
      email,
      phoneNumber,
      password: hashedPassword
    }
  })

  return generateResponse({ message: 'Seller created successfully' })
}