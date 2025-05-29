export async function getUserByPhone(params: { phone: string }) {
  try {
    console.log('trying to call');
    const res = await fetch(`/api/users/phone/${params.phone}`);
    const body = await res.json();
    return body;
  } catch (err) {
    return err;
  }
}
