import { NextRequest, NextResponse } from 'next/server'
import { getUsersWithProfileAndAuth } from '@/actions/users'

export async function GET() {
  try {
    const users = await getUsersWithProfileAndAuth()
    return NextResponse.json(users)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
