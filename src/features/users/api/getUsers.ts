import { UserDTO } from '@/types/user/user.dto'
import { UpdateProviderParams } from '@/types/user/user.params'
import { ProviderView } from '@/types/user/user.view'
import { createClient } from '@supabase/supabase-js'
import { objSnakeToCamel } from '@/lib/utils'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

export async function getUsersWithProfileAndAuth(): Promise<ProviderView[]> {
  const { data: users, error: usersError } = await supabaseAdmin
    .from<'users', UserDTO>('users')
    .select('*, providers(*), roles(*)')

  if (usersError) throw new Error(usersError.message)

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
  if (authError) throw new Error(authError.message)

  const merged: ProviderView[] = users.map((user) => {
    const profile = objSnakeToCamel(user?.providers) || null
    const authUser = authData.users.find((a) => a.id === user.id)

    if (!authUser) throw new Error(`Missing auth.user fro user ${user.id}`)
    return {
      id: user.id,
      role: user.roles,
      profile,
      email: authUser?.email ?? null,
      status: authUser?.email_confirmed_at ? 'active' : 'inactive',
      createdAt: authUser.created_at,
      lastLoggedIn: authUser?.last_sign_in_at ?? null,
    }
  })

  return merged
}
