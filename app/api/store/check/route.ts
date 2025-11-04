import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/server-helper";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { storeName } = await req.json();

    if (!storeName?.trim()) {
      return errorResponse("storeName is required");
    }

    const store = await prisma.seller.findUnique({
      where: { storeName },
      select: { storeName: true },
    });

    if (store) {
      return errorResponse("Store name already exists");
    }

    return successResponse({ exists: false });

  } catch (err: unknown) {
    return errorResponse(err);
  }
}
