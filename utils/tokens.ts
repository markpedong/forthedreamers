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
  if ("role" in user) {
    const { id, username, firstName, lastName, email, role } = user;
    return jwt.sign({ id, username, firstName, lastName, email, role, type: "user" }, JWT_SECRET, {
      expiresIn: "15m",
    });
  } else {
    const { id, name, email } = user;
    return jwt.sign({ id, name, email, type: "seller" }, JWT_SECRET, {
      expiresIn: "15m",
    });
  }
};