import { UpdateUserStatusParams } from '@/types/user/user.params'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)
export async function updateUserStatus(params: UpdateUserStatusParams) {
  try {
    const res = await fetch(`/api/users/${params.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to update user status')
    toast.success(`${params.status === 'active' ? 'Activated' : 'Deactivated'} user`)
    return res.json()
  } catch (err) {
    throw new Error('Server error')
  }
}
