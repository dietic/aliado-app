import { supabase } from '@/lib/supabaseAdmin';
import { RoleDTO } from '@/types/role/role.dto';

export async function getRoles() {
  const { data: roles, error: rolesError } = await supabase
    .from<'roles', RoleDTO[]>('roles')
    .select('*');
  if (rolesError) throw new Error(rolesError.message);
  return roles;
}
