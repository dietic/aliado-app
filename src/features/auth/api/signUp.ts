export async function signUp(params: any): Promise<any> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    const body = await res.json();
    return body;
  } catch (err) {
    return err;
  }
}
