import prisma from "@/db";
import { generateResponse } from "@/utils/helpers";
import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { firstName, lastName, email, phoneNumber, password, username } = body

  const hashedPassword = await bcrypt.hash(password, 12)


  await prisma.users.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      role: USER_ROLE.SELLER,
      password: hashedPassword
    }
  })

  return generateResponse({ message: 'Seller created successfully' })
}