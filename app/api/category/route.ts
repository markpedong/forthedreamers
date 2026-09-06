import { NextRequest, NextResponse } from 'next/server';
import { publicCategories } from '@/lib/services/catalog';
import { addCategory, updateCategory } from '@/lib/actions/admin-catalog';
export async function GET() { return NextResponse.json({ success: true, data: await publicCategories() }); }
export async function POST(req: NextRequest) { const result = await addCategory((await req.json()).name); return NextResponse.json(result, { status: result.success ? 200 : 400 }); }
export async function PUT(req: NextRequest) { const result = await updateCategory(await req.json()); return NextResponse.json(result, { status: result.success ? 200 : 400 }); }
