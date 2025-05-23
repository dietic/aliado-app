import { NextRequest, NextResponse } from 'next/server'
import { getUsersWithProfileAndAuth } from '@/features/users/api/getUsers'
import { updateUserProfile } from '@/features/users/api/updateUser'
import { UpdateProviderParams } from '@/types/user/user.params'

export async function GET() {
  try {
    const users = await getUsersWithProfileAndAuth()
    return NextResponse.json(users)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(params: UpdateProviderParams) {
  try {
    const updatedUser = await updateUserProfile(params)
    return NextResponse.json(updatedUser)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
