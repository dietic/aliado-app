import { LoginParams } from '../../../types/auth/auth.params';
import { LoginApiResponse } from '../../../types/auth/auth.dto';

export async function login(params: LoginParams): Promise<LoginApiResponse> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    const body = await res.json();
    return body;
  } catch (err) {
    console.error('Login API call failed:', err);
    throw err;
  }
}
