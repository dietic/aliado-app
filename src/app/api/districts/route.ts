import { supabase } from '@/lib/supabaseAdmin'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase.from('districts').select('*')
  if (error) throw new Error(error.message)
  return NextResponse.json(data)
}
