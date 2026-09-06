import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server-actions";
import { successResponse, errorResponse, getPaginatedData } from "@/lib/server-helper";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/support/tickets
 * Get user's support tickets with pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";

    const where: any = { userId: session.user.id };
    if (status) {
      where.status = status;
    }

    const result = await getPaginatedData({
      model: "supportTicket",
      where: { ...where, page, pageSize: limit },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return successResponse({
      tickets: result.data,
      total: result.total,
      page: result.page,
      limit: result.pageSize,
    });
  } catch (error) {
    console.error("Get support tickets error:", error);
    return errorResponse("Internal server error");
  }
}

/**
 * POST /api/support/tickets
 * Create a new support ticket.
 */
const ticketSchema = z.object({
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  category: z.enum(["ORDER", "PRODUCT", "SHIPPING", "ACCOUNT", "OTHER"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
  orderId: z.string().optional(),
  productId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const body = await request.json();
    const validated = ticketSchema.parse(body);

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        subject: validated.subject,
        message: validated.message,
        category: validated.category,
        priority: validated.priority,
        orderId: validated.orderId,
        productId: validated.productId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return successResponse(ticket, "Support ticket created", 201);
  } catch (error) {
    console.error("Create support ticket error:", error);
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid input data");
    }
    return errorResponse("Internal server error");
  }
}

/**
 * GET /api/support/tickets/[id]
 * Get a specific support ticket.
 */
export async function GET_BY_ID(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const { id } = await params;

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return errorResponse("Support ticket not found");
    }

    return successResponse(ticket);
  } catch (error) {
    console.error("Get support ticket error:", error);
    return errorResponse("Internal server error");
  }
}

/**
 * POST /api/support/tickets/[id]/messages
 * Add a message to a support ticket.
 */
const messageSchema = z.object({
  message: z.string().min(10).max(2000),
});

export async function POST_MESSAGE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const { id } = await params;
    const body = await request.json();
    const validated = messageSchema.parse(body);

    // Check if ticket exists and belongs to user
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!ticket) {
      return errorResponse("Support ticket not found");
    }

    const newMessage = await prisma.supportMessage.create({
      data: {
        ticketId: id,
        userId: session.user.id,
        message: validated.message,
        isStaff: false,
      },
    });

    // Update ticket's updatedAt timestamp
    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return successResponse(newMessage, "Message added to ticket", 201);
  } catch (error) {
    console.error("Add support message error:", error);
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid input data");
    }
    return errorResponse("Internal server error");
  }
}

/**
 * GET /api/support/admin/tickets
 * Get all support tickets (admin only).
 */
export async function GET_ADMIN(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }

    const result = await getPaginatedData({
      model: "supportTicket",
      where: { ...where, page, pageSize: limit },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: true,
      },
    });

    return successResponse({
      tickets: result.data,
      total: result.total,
      page: result.page,
      limit: result.pageSize,
    });
  } catch (error) {
    console.error("Get admin support tickets error:", error);
    return errorResponse("Internal server error");
  }
}
