import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseAdmin';
import { customErrors, handleApiError, handleApiSuccess } from '@/lib/handleApi';
import { LoginFormData, loginSchema } from '@/features/auth/schemas/loginSchema';
import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errors';

// Define an interface for the expected RPC response
interface ProviderEmail {
  email: string | null; // Allow email to be null if the RPC might return that
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return handleApiError('BAD_REQUEST');
  }

  const validationResult = loginSchema.safeParse(body);
  if (!validationResult.success) {
    const validationErrors = validationResult.error.errors;
    // TODO: Improve error mapping
    const errors = validationErrors.map((err) => err.path[0].toString());
    return customErrors.validationError(errors);
  }

  const { phone, password }: LoginFormData = validationResult.data;

  const sanitizedPhone = phone.trim();
  const sanitizedPassword = password.trim();

  const { data: providerData, error: providerError } = await supabase
    .rpc('get_user_email_by_phone', { p_phone: sanitizedPhone })
    .single<ProviderEmail>(); // Specify the expected return type here

  if (providerError && providerError.code !== 'PGRST116') {
    // PGRST116: "Query returned no rows"
    console.error('Supabase RPC error:', providerError);
    return handleApiError(providerError); // Or a more generic error
  }

  if (providerData && providerData.email) {
    const { data: loggedInData, error: loginError } = await supabase.auth.signInWithPassword({
      email: providerData.email,
      password: sanitizedPassword, // Use sanitized password
    });

    if (loginError) {
      return handleApiError(ERROR_CODES.INVALID_CREDENTIALS);
    }
    return handleApiSuccess(loggedInData);
  } else {
    // This case handles: phone not found (providerData is null or providerData.email is null)
    return handleApiError(ERROR_CODES.INVALID_CREDENTIALS);
  }
}
