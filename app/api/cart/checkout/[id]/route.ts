import { removeServerCookie } from "@/lib/server";
import { generateResponse } from "@/utils/helpers";
import { cookies } from "next/headers";
import { NextRequest, } from "next/server";

export async function DELETE(request: NextRequest) {
  console.log("request", request.cookies.getAll())
  const cookiesValue = await cookies()

  console.log('cookiesValues', cookiesValue.getAll())
  // Correctly remove the HTTP-only cookie by setting Max-Age=0
  await removeServerCookie("orderID");

  return generateResponse({ message: 'Order deleted successfully' })
}