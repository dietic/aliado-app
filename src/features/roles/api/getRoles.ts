import { RoleDTO } from '@/types/role/role.dto'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

export async function getRoles() {
  const { data: roles, error: rolesError } = await supabaseAdmin
    .from<'roles', RoleDTO[]>('roles')
    .select('*')
  if (rolesError) throw new Error(rolesError.message)
  return roles
}
