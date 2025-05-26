export async function getCategories() {
  try {
    const res = await fetch('/api/categories')
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
  } catch (err) {
    throw new Error('Server error')
  }
}
