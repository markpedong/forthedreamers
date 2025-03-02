import { JWT_SECRET } from '@/constants';
import { Users } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const generateRefreshToken = (user: Users) => {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const generateAccessToken = (user: Users) => {
  const { id, username, firstName, lastName, email } = user;
  return jwt.sign(
    { id, username, firstName, lastName, email },
    JWT_SECRET,
    { expiresIn: 30 }
  );
};
