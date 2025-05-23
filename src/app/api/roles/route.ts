import { NextRequest, NextResponse } from 'next/server'
import { getRoles } from '@/features/roles/api/getRoles'

export async function GET() {
  try {
    const roles = await getRoles()
    return NextResponse.json(roles)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
