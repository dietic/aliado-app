import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Create Supabase client - we'll use the service role key to bypass RLS temporarily
    // but still validate the user token
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create a regular client to validate the token
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Verify the token and get the user
    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to fetch provider data
    const { data: providerData, error: providerError } = await adminSupabase
      .from('providers')
      .select(
        `
        id,
        user_id,
        dni,
        first_name,
        last_name,
        phone,
        rating,
        created_at
      `
      )
      .eq('user_id', user.id)
      .maybeSingle();

    if (providerError) {
      return NextResponse.json({ error: 'Failed to fetch provider data' }, { status: 500 });
    }

    // If no provider found, return null
    if (!providerData) {
      return NextResponse.json({ provider: null });
    }

    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await adminSupabase
      .from('provider_categories')
      .select(
        `
        categories!inner(
          id,
          slug,
          name
        )
      `
      )
      .eq('provider_id', providerData.id);

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      // Continue without categories rather than failing
    }

    // Fetch districts
    const { data: districtsData, error: districtsError } = await adminSupabase
      .from('provider_districts')
      .select(
        `
        districts!inner(
          id,
          slug,
          name
        )
      `
      )
      .eq('provider_id', providerData.id);

    if (districtsError) {
      console.error('Error fetching districts:', districtsError);
      // Continue without districts rather than failing
    }

    // Transform the data
    const provider = {
      id: providerData.id,
      user_id: providerData.user_id,
      dni: providerData.dni,
      firstName: providerData.first_name,
      lastName: providerData.last_name,
      phone: providerData.phone,
      rating: providerData.rating,
      categories:
        categoriesData?.map((pc: any) => ({
          id: pc.categories.id,
          slug: pc.categories.slug,
          display_name: pc.categories.name,
        })) || [],
      districts:
        districtsData?.map((pd: any) => ({
          id: pd.districts.id,
          slug: pd.districts.slug,
          display_name: pd.districts.name,
        })) || [],
    };

    return NextResponse.json({ provider });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
}
