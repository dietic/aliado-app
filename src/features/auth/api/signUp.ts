import { SignUpParams } from '../../../types/auth/auth.params';
import { LoginApiResponse } from '../../../types/auth/auth.dto';

export async function signUp(params: SignUpParams): Promise<LoginApiResponse> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    const body = await res.json();
    return body;
  } catch (err) {
    console.error('SignUp API call failed:', err);
    throw err;
  }
}
