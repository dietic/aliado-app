import { ProviderView } from '@/types/user/user.view'
import { createClient } from '@supabase/supabase-js'

export async function getUsers(): Promise<ProviderView[]> {
  try {
    const res = await fetch('/api/users')
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
  } catch (err) {
    throw new Error('Server error')
  }
}
