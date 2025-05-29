import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: providerData, error: providerError } = await supabase
      .rpc('get_user_email_by_phone', { p_phone: phone })
      .single();
    console.log('Provider error:', providerError);
    if (providerError && providerError.code !== 'PGRST116')
      throw new Error('Error fetching provider data');
    console.log('Provider data:', providerData);
    if (providerData) {
      const { data: loggedInData, error: loginError } = await supabase.auth.signInWithPassword({
        email: providerData.email,
        password,
      });
      console.log('Logged in data:', loggedInData);
      console.log('Login error:', loginError);
      if (loggedInData) {
        return NextResponse.json({ user: loggedInData.user }, { status: 200 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
