import { NextRequest, NextResponse } from 'next/server'
import { UserDTO } from '@/types/user/user.dto'
import { objSnakeToCamel } from '@/lib/utils'
import { ProviderView } from '@/types/user/user.view'
import { supabase } from '@/lib/supabaseAdmin'

export async function GET() {
  const { data: users, error: usersError } = await supabase
    .from<'users', UserDTO>('users')
    .select('*, providers(*), roles(*)')

  if (usersError) throw new Error(usersError.message)

  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
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

  return NextResponse.json(merged)
}

export async function PATCH(req: NextRequest) {
  // return NextResponse.json({ message: 'update user' })
  // const { id, firstName, lastName, email, phone, roleId, isActive } = req.body
  const { id, name, email, phone, role, status } = await req.json()
  if (role?.id) {
    const { data: updateUserData, error: updateUserDataError } = await supabase
      .from('users')
      .update({
        role_id: role?.id,
      })
      .eq('id', id)
  }
  const { data: updateUserData, error: updateUserError } = await supabase.from('providers').update({
    ...(name && { first_name: name }),
    // ...(lastName && { last_name: la }),
    ...(email && { email }),
    ...(phone && { phone }),
  })
  if (updateUserError) throw new Error(`Provider update failed: ${updateUserError.message}`)
  console.log(updateUserData)
  return NextResponse.json(updateUserData)
}
