import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export const successResponse = (data: any = null, message = "OK", status = 200) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    {
      status,
    }
  );
};

const prismaErrorMap: Record<string, { message: string; status: number }> = {
  P2002: { message: "Unique constraint failed", status: 400 },
  P2025: { message: "Record not found", status: 404 },
  P2003: { message: "Foreign key constraint failed", status: 400 },
};

export const errorResponse = (err: unknown) => {
  let message = "Unknown server error";
  let status = 500;

  // String error (manual)
  if (typeof err === "string") {
    message = err;
    status = 400;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = prismaErrorMap[err.code];
    if (mapped) {
      message = mapped.message;
      status = mapped.status;
    } else {
      message = `Database error: ${err.message}`;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Invalid data passed to the database";
    status = 400;
  }

  if (err instanceof Error) {
    message = err.message;
  }

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
};


