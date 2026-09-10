import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getCurrentUserID } from '@/lib/auth';
import { socialLinkUrl } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({ provider: z.enum(['google', 'github']), next: z.string().startsWith('/').max(200) });

export const POST = async (request: NextRequest) => {
  if (!(await getCurrentUserID())) return errorResponse('Unauthorized', 401);
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return errorResponse('Invalid account link request', 400);
  try {
    return successResponse({ url: await socialLinkUrl(parsed.data.provider, parsed.data.next) });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to link account', 400);
  }
};
