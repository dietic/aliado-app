import { UpdateProviderParams } from '@/types/user/user.params';
export async function updateUser(params: UpdateProviderParams) {
  try {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  } catch (err) {
    throw new Error('Server error');
  }
}
