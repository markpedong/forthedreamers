import prisma from "@/db";
import { generateResponse, validateUUID } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return generateResponse({ error: 'Invalid Email', status: 400 })
  }

  const user = await prisma.newsLetter.create({
    data: {
      email
    }
  })

  return generateResponse({ data: user, message: 'Subscribed successfully' })
}