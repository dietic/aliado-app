import { ROLES } from '@/constants/roles'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseAdmin'
import { PcCase } from 'lucide-react'
import { generateReadablePassword } from '@/utils/generatePassword'

const roles = ROLES

export async function GET() {
  const {
    data: { users },
    error: usersError,
  } = await supabase.auth.admin.listUsers()
  if (usersError) throw new Error(usersError.message)
  if (users) {
    const { data: providersData, error: providersError } = await supabase.from('providers').select(`
    *,
    provider_categories (
      category: categories (*)
    ),
    provider_districts (
      district: districts (*)
    )
  `)
    if (providersError) throw new Error(providersError.message)
    if (providersData) {
      const merged = users.map((user) => {
        const provider = providersData.find((p) => p.user_id === user.id)
        if (!provider) throw new Error(`Missing auth.user from user ${user.id}`)
        return {
          id: user.id,
          role: roles[(user?.user_metadata?.role as String).toUpperCase()],
          email: user.email,
          provider: {
            id: user.id,
            dni: provider.dni,
            firstName: provider.first_name,
            lastName: provider.last_name,
            phone: provider.phone,
            rating: provider.rating,
            categories: provider.provider_categories.map((pc) => ({
              id: pc.category.id,
              name: pc.category.name,
              slug: pc.category.slug,
            })),
            districts: provider.provider_districts.map((pd) => ({
              id: pd.district.id,
              name: pd.district.name,
              slug: pd.district.slug,
            })),
          },
          status: user.user_metadata.status,
          updatedAt: user.updated_at,
          createdAt: user.created_at,
          lastLoggedIn: user.last_sign_in_at,
        }
      })
      const sorted = merged.sort(
        (a, b) => new Date(b.updatedAt ?? '').getTime() - new Date(a.updatedAt ?? '').getTime()
      )
      return NextResponse.json(sorted)
    }
  }
}

export async function PATCH(req: NextRequest) {
  const { id, firstName, lastName, email, phone, role, status, categories, districts } =
    await req.json()
  if (email || role || status) {
    const { data: updateUserData, error: updateUserError } =
      await supabase.auth.admin.updateUserById(id, { email, user_metadata: { role, status } })
  }
  const { data: updateProviderData, error: updateProviderError } = await supabase
    .from('providers')
    .update({
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
      ...(phone && { phone }),
    })
    .eq('user_id', id)
    .select()
    .single()
  if (updateProviderError) throw new Error(`Provider update failed: ${updateProviderError.message}`)
  if (updateProviderData) {
    const { data: deleteCategoriesData, error: deleteCategoriesError } = await supabase
      .from('provider_categories')
      .delete()
      .eq('provider_id', updateProviderData?.id)
    const { data: deleteDistrictsData, error: deleteDistrictsError } = await supabase
      .from('providers_districts')
      .delete()
      .eq('provider_id', updateProviderData?.id)

    const { data: updateProviderCategory, error: updateProviderCategoryError } = await supabase
      .from('provider_categories')
      .insert(
        categories?.map((category) => ({
          provider_id: updateProviderData?.id,
          category_id: category.id,
        }))
      )
    const { data: updateProviderDistrict, error: updateProviderDistrictError } = await supabase
      .from('provider_districts')
      .insert(
        districts?.map((district) => ({
          provider_id: updateProviderData?.id,
          district_id: district.id,
        }))
      )
  }
  return NextResponse.json(updateProviderData)
}

export async function POST(req: NextRequest) {
  const { email, role, status } = await req.json()
  const { data: createUserData, error: createUserError } = await supabase.auth.admin.createUser({
    email,
    password: generateReadablePassword(),
    user_metadata: {
      role,
      status,
    },
  })
  if (createUserError) throw new Error('Error creting user')
  if (createUserData) {
    const { data: createProviderData, error: createProviderError } = await supabase
      .from('providers')
      .insert({
        user_id: createUserData.user.id,
      })
    if (createProviderError) {
      await supabase.auth.admin.deleteUser(createUserData.user.id)
      throw new Error(createProviderError.message)
    }
  }
  return NextResponse.json(createUserData)
}
