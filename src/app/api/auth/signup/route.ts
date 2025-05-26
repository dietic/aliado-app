import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseAdmin'
import { ROLES } from '@/constants/roles'
import { STATUS } from '@/constants/status'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { firstName, lastName, email, password, phone } = body

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: supabaseCreatedUser, error: supabaseCreatedUserError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: ROLES.PROVIDER,
            status: STATUS.INACTIVE,
          },
        },
      })

    if (supabaseCreatedUserError) {
      return NextResponse.json({ error: 'Error creating supabase user' }, { status: 500 })
    }

    if (supabaseCreatedUser?.user) {
      const { data: createdProvider, error: createdProviderError } = await supabase
        .from('providers')
        .insert({
          user_id: supabaseCreatedUser?.user.id,
          first_name: firstName,
          last_name: lastName,
          phone,
        })
        .select()

      if (createdProviderError)
        return NextResponse.json({ error: 'Error creating provider' }, { status: 500 })

      if (createdProvider) {
        return NextResponse.json({ createdProvider }, { status: 200 })
      }
      // TODO: improve errors
      await supabase.auth.admin.deleteUser(supabaseCreatedUser?.user?.id)
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
