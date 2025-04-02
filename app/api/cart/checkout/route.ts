import { TCheckoutPayload } from "@/constants/types";
import prisma from "@/db";
import { removeServerCookie, setCookie } from "@/lib/server";
import { generateResponse, isAuthenticated } from "@/utils/helpers";
import { STATUS } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { ids, address, payment } = await req.json() as TCheckoutPayload
  if (!ids || !address || !payment) {
    return generateResponse({ error: 'Missing required fields', status: 400 })
  }

  const cartItems = await prisma.carts.findMany({
    where: { id: { in: ids } }
  })
  if (cartItems.length !== ids.length) {
    return generateResponse({ error: 'Invalid cart items', status: 400 })
  }

  const variationItems = await prisma.variations.findMany({
    where: { id: { in: cartItems?.map(item => item.variationId) } }
  })

  const order = await prisma.orders.create({
    data: {
      userId: cartItems[0].userId,
      addressID: address,
      status: STATUS.PENDING,
    }
  })

  const orderItems = await prisma.orderItems.createManyAndReturn({
    data: cartItems.map(item => ({
      ordersId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: variationItems.find(variation => variation.id === item.variationId)!.price
    })),
  });

  await prisma.orders.update({
    where: { id: order.id },
    data: {
      total: orderItems.reduce((total, item) => total + item.price * item.quantity, 0),
      totalItems: orderItems.reduce((total, item) => total + item.quantity, 0),
    }
  })

  await prisma.carts.deleteMany({
    where: { id: { in: ids } }
  })


  await setCookie('orderID', order.id, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  })

  return generateResponse({ message: 'Checkout successful' })
}


export async function DELETE() {
  await removeServerCookie("orderID");

  return generateResponse({ message: 'Order deleted successfully' })
}