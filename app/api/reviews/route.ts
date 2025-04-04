import { TReviewPayload } from "@/constants/types";
import prisma from "@/db";
import { generateResponse, isAuthenticated } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const body: TReviewPayload[] = await req.json()
  const orderItemIds = body.map(({ id }) => id);

  try {
    await prisma.reviews.createMany({
      data: body?.map(({ id, ...rest }) => rest),
    })

    await prisma.orderItems.updateMany({
      where: {
        id: { in: orderItemIds },
      },
      data: {
        hasReview: true,
      },
    });

    return generateResponse({ message: "review submitted" })
  } catch (error) {
    return generateResponse({ status: 500, error, message: "error in submitting review" })

  }
}