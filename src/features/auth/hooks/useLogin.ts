import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/login';
import { supabaseClient } from '@/lib/supabaseClient';
import { LoginApiResponse, LoginSuccessResponse } from '@/types/auth/auth.dto';
import { ApiError } from '@/types/api/response.dto';

export function useLogin(
  options: UseMutationOptions<
    LoginApiResponse,
    Error,
    { phone: string; password: string },
    any
  > = {}
) {
  const queryClient = useQueryClient();
  return useMutation<LoginApiResponse, Error, { phone: string; password: string }, any>({
    mutationFn: login,
    onSuccess: async (response, variables, context) => {
      if (response.success) {
        const successData = response as LoginSuccessResponse;
        console.log('[useLogin] Login success. Response data:', successData);

        if (
          !successData.data ||
          !successData.data.session ||
          !successData.data.session.access_token ||
          !successData.data.session.refresh_token
        ) {
          console.error(
            '[useLogin] Critical: Session tokens missing in API response.',
            successData.data
          );
          throw new Error('Login successful, but session tokens are missing in the response.');
        }

        console.log('[useLogin] Access Token:', successData.data.session.access_token);
        console.log('[useLogin] Refresh Token:', successData.data.session.refresh_token);

        const { error: setSessionError } = await supabaseClient.auth.setSession({
          access_token: successData.data.session.access_token,
          refresh_token: successData.data.session.refresh_token,
        });

        console.log('[useLogin] setSession error object:', setSessionError);

        if (setSessionError) {
          console.error('[useLogin] Failed to initialize client session:', setSessionError);
          throw new Error(`Failed to initialize client session: ${setSessionError.message}`);
        }

        console.log(
          '[useLogin] Session set successfully according to setSession. Invalidating queries.'
        );
        queryClient.invalidateQueries({ queryKey: ['auth'] });

        // Verify if getUser() reflects the new session immediately
        const {
          data: { user: userAfterSetSession },
          error: getUserError,
        } = await supabaseClient.auth.getUser();

        console.log('[useLogin] User object after setSession and getUser():', userAfterSetSession);
        console.log('[useLogin] GetUser error after setSession:', getUserError);

        if (getUserError || !userAfterSetSession) {
          console.warn('[useLogin] Warning: getUser after setSession failed or returned no user.', {
            getUserError,
            userAfterSetSession,
          });
          // This is a strong indicator the session isn't active as expected for subsequent client-side checks.
        }

        if (options.onSuccess) {
          options.onSuccess(response, variables, context);
        }
      } else {
        const errorData = response as ApiError;
        const errorMessage = errorData.error.message || 'Login failed due to an unknown API error.';
        console.error('[useLogin] Login API returned error:', errorMessage, errorData);
        throw new Error(errorMessage);
      }
    },
    ...options,
  });
}
