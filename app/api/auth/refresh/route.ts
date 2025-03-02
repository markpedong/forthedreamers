import prisma from '@/db';
import { generateResponse } from '@/utils/helpers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/constants';
import { generateAccessToken } from '@/utils/tokens';

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return generateResponse({ error: 'Refresh token required', status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
    } catch (error) {
      return generateResponse({ error: 'Invalid refresh token', status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return generateResponse({ error: 'Invalid refresh token', status: 401 });
    }

    const newAccessToken = generateAccessToken(user);

    return generateResponse({ data: { accessToken: newAccessToken }, status: 200 });
  } catch (error) {
    return generateResponse({ error: 'Server error', status: 500 });
  }
}
