import { Prisma } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { ApiResponse, TGetPaginatedData } from "./types";
import prisma from "./prisma";

export const successResponse = (data: any = null, message = "OK", status = 200) => {
  return NextResponse.json(
    {
      success: true,
      message,
      ...data,
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


  if (typeof err === "string") {
    message = err;
    status = 400;
  }


  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErrorMap: Record<string, { message: string; status: number }> = {
      P2002: { message: "Unique constraint failed", status: 400 },
      P2025: { message: "Record not found", status: 404 },
      P2003: { message: "Foreign key constraint failed", status: 400 },
    };

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

export const getPaginatedData = async <T extends object>({ model, where, include, orderBy = [{ createdAt: "desc" }, { id: "asc" }] }: TGetPaginatedData): Promise<ApiResponse<T>> => {
  const page = Number(where.page) || 1;
  const pageSize = Number(where.pageSize) || 10;
  const prismaModel = prisma[model] as any;
  delete where.page;
  delete where.pageSize;

  const [total, data] = await Promise.all([
    prismaModel.count({ where }),
    prismaModel.findMany({ where, include, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
  ]);

  return { data, total, page, pageSize, success: true };
}

export const buildServerQuery = (url: URL) => {
  const params = Object.fromEntries(url.searchParams.entries());
  const where: Record<string, any> = {};

  if (params.dateRange) {
    const [start, end] = params.dateRange.split(",").map((d) => new Date(d.replace(" ", "T")));
    if (!isNaN(+start) && !isNaN(+end)) where.createdAt = { gte: start, lte: end };
  }

  Object.entries(params).forEach(([key, value]) => {
    if (!value || key === "dateRange") return;
    where[key] = key === "status" ? value : { contains: value, mode: "insensitive" };
  });

  if (params.page) where.page = params.page;
  if (params.pageSize) where.pageSize = params.pageSize;

  return where;
};