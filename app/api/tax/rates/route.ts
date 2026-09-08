import { NextRequest } from 'next/server';
import { getSession } from '@/lib/services/auth';
import { successResponse, errorResponse } from '@/lib/server-helper';

/**
 * GET /api/tax/rates
 * Get tax rates for a region.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 400);
    }

    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || '';

    // Simple tax calculation (can be extended with real tax rates)
    const TAX_RATES: Record<string, number> = {
      us: 0.08,
      eu: 0.2,
      uk: 0.2,
      ca: 0.05,
      au: 0.1,
    };

    const rate = TAX_RATES[region] || 0.08; // Default 8%

    return successResponse({
      taxRate: rate,
      regions: Object.keys(TAX_RATES),
    });
  } catch (error) {
    console.error('Get tax rates error:', error);
    return errorResponse('Internal server error', 400);
  }
}

/**
 * GET /api/tax/calculate
 * Calculate tax for an order.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse('Unauthorized', 400);
    }

    const body = await request.json();
    const { region, items } = body;

    if (!region || !items) {
      return errorResponse('Missing required fields', 400);
    }

    // Get tax rate for region
    const TAX_RATES: Record<string, number> = {
      us: 0.08,
      eu: 0.2,
      uk: 0.2,
      ca: 0.05,
      au: 0.1,
    };

    const rate = TAX_RATES[region] || 0.08; // Default 8%
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const taxAmount = subtotal * rate;

    return successResponse({
      taxRate: rate,
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    });
  } catch (error) {
    console.error('Calculate tax error:', error);
    return errorResponse('Internal server error', 400);
  }
}
