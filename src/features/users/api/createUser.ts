export async function createUser(params: any) {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to create user')
    return res.json()
  } catch (err) {
    throw new Error('Server error')
  }
}
