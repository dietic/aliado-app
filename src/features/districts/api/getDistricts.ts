import { DistrictDTO } from '@/types/district/district.dto'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

export async function getDistricts() {
  const { data: districts, error: districtsError } = await supabaseAdmin
    .from<'districts', DistrictDTO[]>('districts')
    .select('*')
  if (districtsError) throw new Error(districtsError.message)
  return districts
}
