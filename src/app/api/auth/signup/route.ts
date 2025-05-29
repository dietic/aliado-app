import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseAdmin';
import { ROLES } from '@/constants/roles';
import { STATUS } from '@/constants/status';
import { ratelimit } from '@/lib/ratelimit'; // Assuming you have rate limiting
import { SignUpFormData, signUpSchema } from '@/features/auth/schemas/signupSchema';
import { handleApiError, customErrors, handleApiSuccess } from '@/lib/handleApi';

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('cf-connecting-ip') ??
    '127.0.0.1';

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return customErrors.rateLimitExceededError();
  }

  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return handleApiError('BAD_REQUEST');
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return handleApiError('BAD_REQUEST');
  }

  const validationResult = signUpSchema.safeParse(body);
  if (!validationResult.success) {
    const validationErrors = validationResult.error.errors;
    // TODO: Improve error mapping
    const errors = validationErrors.map((err) => err.path[0].toString());
    return customErrors.validationError(errors);
  }
  const { firstName, lastName, email, password, phone }: SignUpFormData = validationResult.data;

  // Sanitize input data
  const sanitizedData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
  };

  // Check if user already exists by email
  // const { data: existingUser, error: existingUserError } = await supabase.auth.getUser(email);

  // if (existingUser?.user) {
  //   return handleApiError(existingUserError);
  // }

  // Check if phone number already exists
  const { data: existingProvider, error: existingProviderError } = await supabase
    .from('providers')
    .select('id')
    .eq('phone', sanitizedData.phone)
    .single();

  console.log('existingProvider', existingProvider);
  console.log('supabase create user error', existingProviderError);
  if (existingProvider) {
    return handleApiError('CONFLICT', 'User already exists with this phone number');
  }

  // Create user in Supabase Auth
  const { data: supabaseCreatedUser, error: supabaseCreatedUserError } = await supabase.auth.signUp(
    {
      email: sanitizedData.email,
      password,
      options: {
        data: {
          role: ROLES.PROVIDER,
          status: STATUS.INACTIVE,
        },
      },
    }
  );

  if (supabaseCreatedUserError) {
    console.log('supabase create user error', supabaseCreatedUserError);
    return handleApiError(supabaseCreatedUserError);
  }

  if (!supabaseCreatedUser?.user?.id) {
    return handleApiError('INTERNAL_ERROR');
  }

  // Create provider record
  const { data: createdProvider, error: createdProviderError } = await supabase
    .from('providers')
    .insert({
      user_id: supabaseCreatedUser.user.id,
      first_name: sanitizedData.firstName,
      last_name: sanitizedData.lastName,
      phone: sanitizedData.phone,
    })
    .select('id, first_name, last_name, phone')
    .single();

  if (createdProviderError) {
    try {
      await supabase.auth.admin.deleteUser(supabaseCreatedUser.user.id);
    } catch (cleanupError) {
      return handleApiError('INTERNAL_ERROR');
    }
  }
  if (createdProvider) {
    const user = {
      id: createdProvider.id,
      firstName: createdProvider.first_name,
      lastName: createdProvider.last_name,
      phone: createdProvider.phone,
      status: supabaseCreatedUser.user?.user_metadata?.status || STATUS.INACTIVE,
    };
    return handleApiSuccess(user);
  }
  return handleApiError(createdProviderError);
}
