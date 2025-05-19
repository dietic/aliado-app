import { UserDTO } from '@/types/user/user.dto'
import { UpdateProviderParams, UpdateUserParams } from '@/types/user/user.params'
import { ProviderView } from '@/types/user/user.view'
import { createClient } from '@supabase/supabase-js'

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

  const merged = users.map((user) => {
    const profile = user?.providers || null
    const authUser = authData.users.find((a) => a.id === user.id)

    return {
      id: user.id,
      role: user.roles,
      profile,
      email: authUser?.email ?? null,
      status: authUser?.email_confirmed_at ? 'active' : 'pending',
      createdAt: authUser?.created_at ?? null,
      updatedAt: authUser?.updated_at ?? null,
      lastLoggedIn: authUser?.last_sign_in_at ?? null,
    }
  })

  return merged
}

export async function updateUserProfile(params: UpdateProviderParams) {
  const { id, firstName, lastName, email, phone, roleId, isActive } = params

  const { data: updateUserData, error: updateUserError } = await supabaseAdmin
    .from('providers')
    .update({
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(roleId && { role_id: roleId }),
    })
  // 3. Update providers table
  // if (fullName !== undefined || phone !== undefined) {
  //   const nameParts = fullName?.split(' ') ?? []
  //   const firstName = nameParts[0] ?? ''
  //   const lastName = nameParts.slice(1).join(' ') ?? ''

  //   const { error: providerError } = await supabaseAdmin
  //     .from('providers')
  //     .update({
  //       firstName,
  //       lastName,
  //       phone,
  //     })
  //     .eq('user_id', userId)

  //   if (providerError) throw new Error(`Provider update failed: ${providerError.message}`)

  return { success: true }
}
