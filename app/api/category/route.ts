import prisma from "@/lib/prisma";
import { buildServerQuery, errorResponse, successResponse } from "@/lib/server-helper";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const where = buildServerQuery(url);

  const categories = await prisma.category.findMany({
    ...(where.isForProducts && { select: { name: true, id: true } })
  })

  return successResponse({ data: categories });
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    const category = await prisma.category.create({ data: { name } });

    return successResponse({ data: category });
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name } = await request.json();
    const category = await prisma.category.update({ where: { id }, data: { name } });
    return successResponse({ data: category });
  } catch (err: unknown) {
    return errorResponse(err);
  }
}