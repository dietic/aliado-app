export async function getUsers() {
  try {
    const res = await fetch('/api/users')
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
  } catch (err) {
    throw new Error('Server error')
  }
}
