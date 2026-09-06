import { NextRequest, NextResponse } from 'next/server';
import { adminProducts } from '@/lib/services/admin-catalog';
import { createProduct, updateProduct, deleteProduct } from '@/lib/actions/admin-catalog';
// Legacy admin integration boundary, now protected by the same services as the UI.
export async function GET() {
  try { return NextResponse.json({ success: true, data: await adminProducts() }); }
  catch { return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }); }
}
export async function POST(req: NextRequest) { const result = await createProduct(await req.json()); return NextResponse.json(result, { status: result.success ? 200 : 400 }); }
export async function PUT(req: NextRequest) { const result = await updateProduct(await req.json()); return NextResponse.json(result, { status: result.success ? 200 : 400 }); }
export async function DELETE(req: NextRequest) { const result = await deleteProduct((await req.json()).id); return NextResponse.json(result, { status: result.success ? 200 : 400 }); }
