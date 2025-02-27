import { generateResponse, withAuth } from "@/utils/helpers";
import { NextApiRequest } from "next";

export const GET = withAuth(async (req: NextApiRequest) => {
  const { id } = req.query;

  return generateResponse({ data: { id } });
});