export async function login(params: any): Promise<any> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('login res', res);
    if (!res.ok) throw new Error('Failed to login');
    return res.json();
  } catch (err) {
    throw new Error('Server error');
  }
}
