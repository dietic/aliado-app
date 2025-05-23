import { UpdateProviderParams } from '@/types/user/user.params'
import { createClient } from '@supabase/supabase-js'
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)
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
  console.log(updateUserData)
  return { updateUserData }
}
