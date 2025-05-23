import { NextRequest, NextResponse } from 'next/server'
import { getDistricts } from '@/features/districts/api/getDistricts'

export async function GET() {
  try {
    const districts = await getDistricts()
    return NextResponse.json(districts)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
