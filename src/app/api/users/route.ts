import { ROLES } from '@/constants/roles';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseAdmin';
import { generateReadablePassword } from '@/utils/generatePassword';

const rolesConstant = ROLES; // Renamed to avoid conflict with variable name 'roles'

export async function GET() {
  const { data: authUsersResponse, error: usersError } = await supabase.auth.admin.listUsers();
  const authUsers = authUsersResponse?.users;

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }
  if (!authUsers) {
    return NextResponse.json({ users: [] });
  }

  const { data: providersData, error: providersError } = await supabase.from('providers').select(`
    *,
    provider_categories (
      category: categories (*)
    ),
    provider_districts (
      district: districts (*)
    )
  `);

  if (providersError) {
    console.error('Error fetching providers:', providersError);
    return NextResponse.json({ error: providersError.message }, { status: 500 });
  }

  const mergedUsers = authUsers
    .map((user) => {
      const provider = providersData?.find((p) => p.user_id === user.id);

      const userRoleKey = user.user_metadata?.role as string | undefined;
      const userStatus = user.user_metadata?.status as string | undefined;

      let roleData = null;
      if (userRoleKey && rolesConstant[userRoleKey.toUpperCase() as keyof typeof ROLES]) {
        roleData = rolesConstant[userRoleKey.toUpperCase() as keyof typeof ROLES];
      } else if (userRoleKey) {
        console.warn(`Role key "${userRoleKey}" not found in ROLES constant for user ${user.id}`);
      }

      return {
        id: user.id,
        role: roleData,
        email: user.email,
        provider: provider
          ? {
              id: provider.id,
              dni: provider.dni,
              firstName: provider.first_name,
              lastName: provider.last_name,
              phone: provider.phone,
              rating: provider.rating,
              categories:
                provider.provider_categories
                  ?.map((pc: any) =>
                    pc.category
                      ? {
                          id: pc.category.id,
                          name: pc.category.name,
                          slug: pc.category.slug,
                        }
                      : null
                  )
                  .filter(Boolean) ?? [],
              districts:
                provider.provider_districts
                  ?.map((pd: any) =>
                    pd.district
                      ? {
                          id: pd.district.id,
                          name: pd.district.name,
                          slug: pd.district.slug,
                        }
                      : null
                  )
                  .filter(Boolean) ?? [],
            }
          : null,
        status: userStatus || 'unknown',
        updatedAt: user.updated_at,
        createdAt: user.created_at,
        lastLoggedIn: user.last_sign_in_at,
      };
    })
    .filter((item) => item.provider !== null);

  const sortedUsers = mergedUsers.sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  );
  return NextResponse.json(sortedUsers);
}

export async function PATCH(req: NextRequest) {
  const { id, firstName, lastName, email, phone, role, status, categories, districts } =
    await req.json();

  if (!id) {
    return NextResponse.json({ error: 'User ID is required for update.' }, { status: 400 });
  }

  let userMetadataUpdate: any = {};
  if (role) userMetadataUpdate.role = role;
  if (status) userMetadataUpdate.status = status;

  if (email || Object.keys(userMetadataUpdate).length > 0) {
    const updatePayload: any = {};
    if (email) updatePayload.email = email;
    if (Object.keys(userMetadataUpdate).length > 0)
      updatePayload.user_metadata = userMetadataUpdate;

    const { error: updateUserError } = await supabase.auth.admin.updateUserById(id, updatePayload);
    if (updateUserError) {
      console.error('Error updating user auth data:', updateUserError);
      return NextResponse.json({ error: updateUserError.message }, { status: 500 });
    }
  }

  const providerUpdates: any = {};
  if (firstName) providerUpdates.first_name = firstName;
  if (lastName) providerUpdates.last_name = lastName;
  if (phone) providerUpdates.phone = phone;

  let updatedProviderDataResponse: any = null;

  if (Object.keys(providerUpdates).length > 0) {
    const { data, error: updateProviderError } = await supabase
      .from('providers')
      .update(providerUpdates)
      .eq('user_id', id)
      .select()
      .single();
    if (updateProviderError) {
      console.error('Error updating provider data:', updateProviderError);
    }
    updatedProviderDataResponse = data;
  }

  const providerIdToUse = updatedProviderDataResponse?.id;

  if (providerIdToUse && (categories || districts)) {
    if (categories) {
      await supabase.from('provider_categories').delete().eq('provider_id', providerIdToUse);
      if (categories.length > 0) {
        const { error: updateProviderCategoryError } = await supabase
          .from('provider_categories')
          .insert(
            categories.map((category: any) => ({
              provider_id: providerIdToUse,
              category_id: category.id,
            }))
          );
        if (updateProviderCategoryError)
          console.error('Error updating provider categories:', updateProviderCategoryError);
      }
    }
    if (districts) {
      await supabase.from('provider_districts').delete().eq('provider_id', providerIdToUse);
      if (districts.length > 0) {
        const { error: updateProviderDistrictError } = await supabase
          .from('provider_districts')
          .insert(
            districts.map((district: any) => ({
              provider_id: providerIdToUse,
              district_id: district.id,
            }))
          );
        if (updateProviderDistrictError)
          console.error('Error updating provider districts:', updateProviderDistrictError);
      }
    }
  }

  const { data: finalProviderData } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', id)
    .single();
  return NextResponse.json(finalProviderData || updatedProviderDataResponse);
}

export async function POST(req: NextRequest) {
  const { email, role, status, firstName, lastName, phone } = await req.json();

  if (!email || !role || !status) {
    return NextResponse.json(
      { error: 'Email, role, and status are required to create a user.' },
      { status: 400 }
    );
  }

  const { data: createdAuthUserResponse, error: createUserError } =
    await supabase.auth.admin.createUser({
      email,
      password: generateReadablePassword(),
      user_metadata: {
        role,
        status,
      },
      email_confirm: true,
    });
  const createdAuthUser = createdAuthUserResponse?.user;

  if (createUserError) {
    console.error('Error creating user in Supabase Auth:', createUserError);
    return NextResponse.json(
      { error: `Error creating user: ${createUserError.message}` },
      { status: 500 }
    );
  }

  if (createdAuthUser) {
    const providerPayload: any = { user_id: createdAuthUser.id };
    if (firstName) providerPayload.first_name = firstName;
    if (lastName) providerPayload.last_name = lastName;
    if (phone) providerPayload.phone = phone;

    const { data: createProviderData, error: createProviderError } = await supabase
      .from('providers')
      .insert(providerPayload)
      .select()
      .single();

    if (createProviderError) {
      console.error('Error creating provider profile:', createProviderError);
      await supabase.auth.admin.deleteUser(createdAuthUser.id);
      return NextResponse.json(
        { error: `Error creating provider profile: ${createProviderError.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ user: createdAuthUser, provider: createProviderData });
  } else {
    return NextResponse.json(
      { error: 'User creation did not return expected data.' },
      { status: 500 }
    );
  }
}
