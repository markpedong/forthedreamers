import prisma from "@/lib/prisma";
import { successResponse } from "@/lib/server-helper";

export async function GET() {
  const categories = await prisma.category.findMany({
    select: { name: true, id: true }
  })

  return successResponse({ data: categories });
}