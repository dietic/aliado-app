import { DistrictDTO } from '@/types/district/district.dto'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

export async function getCategories() {
  const { data: categories, error: categoriesError } = await supabaseAdmin
    .from<'categories', DistrictDTO[]>('categories')
    .select('*')
  if (categoriesError) throw new Error(categoriesError.message)
  return categories
}
