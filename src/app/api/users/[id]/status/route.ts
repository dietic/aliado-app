import { supabase } from '@/lib/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const { data, error } = await supabase.auth.admin.updateUserById(id, {
    user_metadata: { status },
  })
  if (error) throw new Error(error.message)
  return NextResponse.json(data)
}
