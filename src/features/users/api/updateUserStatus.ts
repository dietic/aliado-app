import { UpdateUserStatusParams } from '@/types/user/user.params';
import { toast } from 'sonner';

export async function updateUserStatus(params: UpdateUserStatusParams) {
  try {
    const res = await fetch(`/api/users/${params.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to update user status');
    toast.success(`${params.status === 'active' ? 'Activated' : 'Deactivated'} user`);
    return res.json();
  } catch (err) {
    throw new Error('Server error');
  }
}
