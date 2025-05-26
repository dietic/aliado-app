import { AuthUser } from '@supabase/supabase-js'

export async function signUp(params: any): Promise<any> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to signup')
    return res.json()
  } catch (err) {
    throw new Error('Server error')
  }
}
