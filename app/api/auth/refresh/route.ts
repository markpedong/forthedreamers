import prisma from '@/db';
import { generateResponse } from '@/utils/helpers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/constants';
import { generateAccessToken } from '@/utils/tokens';
import { getServerSession } from 'next-auth';
import authOptions from '../[...nextauth]/options';
import { NextRequest } from 'next/server';

export async function POST() {
  try {
    const id = (await getServerSession(authOptions))?.user.id

    if (!id) {
      return generateResponse({ error: 'Refresh token not found', status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id },
    })

    let decoded;
    try {
      decoded = jwt.verify(`${user?.refreshToken}`, JWT_SECRET);
    } catch (error) {
      return generateResponse({ error: 'Invalid refresh token', status: 401 });
    }

    const newAccessToken = generateAccessToken(user!);
    return generateResponse({ data: { accessToken: newAccessToken }, status: 200 });
  } catch (error) {
    return generateResponse({ error: 'Server error', status: 500 });
  }
}
