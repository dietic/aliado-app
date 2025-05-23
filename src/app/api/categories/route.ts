import { NextRequest, NextResponse } from 'next/server'
import { getCategories } from '@/features/categories/api/getCategories'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
