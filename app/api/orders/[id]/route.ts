import prisma from "@/db";
import { generateResponse, isAuthenticated, validateUUID } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid order id', status: 400 })
  }

  const orders = await prisma.orders.findMany({
    where: { userId: id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: true
    }
  })

  return generateResponse({ data: orders, message: 'Orders fetched successfully' })
}