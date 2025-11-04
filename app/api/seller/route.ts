import { USER_ROLE } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/server-helper";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { storeName, userID } = await req.json();

    if (!storeName || typeof storeName !== "string") {
      return errorResponse("storeName is required");
    }
    if (!userID || typeof userID !== "string") {
      return errorResponse("userID is required");
    }

    await prisma.user.update({
      where: { id: userID },
      data: { role: USER_ROLE.SELLER },
    });

    await prisma.seller.create({
      data: {
        storeName,
        userId: userID,
      },
    });

    return successResponse({ message: "Seller created" });
  } catch (err: unknown) {
    throw errorResponse(err);
  }
}
