import { Prisma } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import type { ApiErrorResponse, ApiSuccessResponse, TGetPaginatedData } from './types';
import prisma from './prisma';

export const successResponse = <T>(data?: T, message?: string, status = 200) =>
  NextResponse.json<ApiSuccessResponse<T>>(
    {
      success: true,
      ...(data === undefined ? {} : { data }),
      ...(message === undefined ? {} : { message }),
    },
    { status }
  );

export const errorResponse = (err: unknown, responseStatus?: number) => {
  let message = 'Unknown server error';
  let status = responseStatus ?? 500;

  if (typeof err === 'string') {
    message = err;
    status = responseStatus ?? 400;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErrorMap: Record<string, { message: string; status: number }> = {
      P2002: { message: 'Unique constraint failed', status: 400 },
      P2025: { message: 'Record not found', status: 404 },
      P2003: { message: 'Foreign key constraint failed', status: 400 },
    };

    const mapped = prismaErrorMap[err.code];
    if (mapped) {
      message = mapped.message;
      status = responseStatus ?? mapped.status;
    } else {
      message = `Database error: ${err.message}`;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    message = 'Invalid data passed to the database';
    status = responseStatus ?? 400;
  }

  if (err instanceof Error) {
    message = err.message;
  }

  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      message,
    },
    { status }
  );
};

export const getPaginatedData = async <T extends object>({
  model,
  where,
  include,
  orderBy = [{ createdAt: 'desc' }, { id: 'asc' }],
  omit,
}: TGetPaginatedData): Promise<{ success: true; data: T[]; total: number; page: number; pageSize: number }> => {
  const page = Number(where.page) || 1;
  const pageSize = Number(where.pageSize) || 10;
  const prismaModel = prisma[model] as any;
  delete where.page;
  delete where.pageSize;

  const [total, data] = await Promise.all([
    prismaModel.count({ where }),
    prismaModel.findMany({ where, include, orderBy, skip: (page - 1) * pageSize, take: pageSize, omit }),
  ]);

  return { data, total, page, pageSize, success: true };
};
