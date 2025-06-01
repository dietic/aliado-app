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

        const { error: setSessionError } = await supabaseClient.auth.setSession({
          access_token: successData.data.session.access_token,
          refresh_token: successData.data.session.refresh_token,
        });

        if (setSessionError) {
          console.error('[useLogin] Failed to initialize client session:', setSessionError);
          throw new Error(`Failed to initialize client session: ${setSessionError.message}`);
        }
        queryClient.invalidateQueries({ queryKey: ['auth'] });

        const {
          data: { user: userAfterSetSession },
          error: getUserError,
        } = await supabaseClient.auth.getUser();

        if (getUserError || !userAfterSetSession) {
          console.warn('[useLogin] Warning: getUser after setSession failed or returned no user.', {
            getUserError,
            userAfterSetSession,
          });
        }

        if (options.onSuccess) {
          options.onSuccess(response, variables, context);
        }
      } else {
        const errorData = response as ApiError;
        const errorMessage = errorData.error.message || 'Login failed due to an unknown API error.';
        throw new Error(errorMessage);
      }
    },
  });
}
