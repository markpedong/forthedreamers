import { setCookie } from "@/lib/server";
import { generateResponse, isAuthenticated } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { ids, address, payment } = await req.json()

  await setCookie('orderID', 'sample', {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  })

  return generateResponse({ message: 'Checkout successful', data: { ids, address, payment } })
}