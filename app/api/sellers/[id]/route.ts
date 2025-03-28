import prisma from "@/db";
import { generateResponse, isAuthenticated, validateUUID } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid seller id', status: 400 })
  }

  const seller = await prisma.users.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          variations: true
        },
        where: { deletedAt: null }
      }
    }
  })

  return generateResponse({ data: seller, message: 'Seller fetched successfully' })
}