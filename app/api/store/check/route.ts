import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/server-helper";
import { catchRouteErrors } from "@/utils/helper";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const storeName = body.storeName?.trim();

  if (!storeName) {
    return errorResponse("storeName is required");
  }

  // Wrap the Prisma query in catchError
  const [err, store] = await catchRouteErrors(
    prisma.seller.findUnique({
      where: { storeName },
      select: { storeName: true },
    })
  );

  if (err) {
    return errorResponse(err); // Automatically handled by your helper
  }

  if (store) {
    return errorResponse("Store name already exists");
  }

  return successResponse({ exists: false });
}
