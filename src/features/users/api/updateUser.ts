import { UpdateProviderParams } from '@/types/user/user.params'
import { createClient } from '@supabase/supabase-js'
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)
export async function updateUser(params: UpdateProviderParams) {
  try {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to update user')
    return res.json()
  } catch (err) {
    throw new Error('Server error')
  }
}
