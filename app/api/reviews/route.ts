import { TReviewPayload } from "@/constants/types";
import { generateResponse, isAuthenticated } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const body: TReviewPayload[] = await req.json()

  return generateResponse({ data: body, message: "review submitted" })
}