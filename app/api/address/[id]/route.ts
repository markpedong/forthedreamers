import prisma from "@/db";
import { generateResponse, validateUUID } from "@/utils/helpers";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import authOptions from "../../auth/[...nextauth]/options";

export async function GET(_: NextRequest) {
  const session = await getServerSession(authOptions)
  console.log('session', session)
  if (!session) {
    return generateResponse({ error: 'Unauthorized', status: 401 })
  }

  if (!validateUUID(session.user.id)) {
    return generateResponse({ error: 'Invalid address id', status: 400 })
  }

  const address = await prisma.addresses.findMany({
    where: { userId: session.user.id },
  })

  return generateResponse({ data: address, message: 'Address fetched successfully' })
}