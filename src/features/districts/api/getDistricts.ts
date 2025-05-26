export async function getDistricts() {
  try {
    const res = await fetch('/api/districts')
    if (!res.ok) throw new Error('Failed to fetch districts')
    return res.json()
  } catch (err) {
    throw new Error('Server error')
  }
}
