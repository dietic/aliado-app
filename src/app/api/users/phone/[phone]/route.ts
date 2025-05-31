import { handleApiError, handleApiSuccess, customErrors } from '@/lib/handleApi';
import { supabase } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  const { data, error } = await supabase.from('providers').select('*').eq('phone', phone).single();
  if (error && error.code !== 'PGRST116') {
    return handleApiError(error);
  }
  if (error && error.code === 'PGRST116') {
    return customErrors.notFoundError('User');
  }
  if (data) {
    return handleApiSuccess(data);
  } else {
    return customErrors.notFoundError('User');
  }
}
