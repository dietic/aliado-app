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

  // Store the original onSuccess callback
  const originalOnSuccess = options.onSuccess;

  return useMutation<LoginApiResponse, Error, { phone: string; password: string }, any>({
    mutationFn: login,
    onError: options.onError,
    onSuccess: async (response, variables, context) => {
      if (response.success) {
        const successData = response as LoginSuccessResponse;

        // Validate session data exists
        if (
          !successData.data ||
          !successData.data.session ||
          !successData.data.session.access_token ||
          !successData.data.session.refresh_token
        ) {
          throw new Error('Login successful, but session tokens are missing in the response.');
        }

        try {
          // Set session with timeout to prevent hanging
          const setSessionPromise = supabaseClient.auth.setSession({
            access_token: successData.data.session.access_token,
            refresh_token: successData.data.session.refresh_token,
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('setSession timeout')), 5000)
          );

          const { error: setSessionError } = (await Promise.race([
            setSessionPromise,
            timeoutPromise,
          ])) as any;

          if (setSessionError) {
            throw new Error(`Failed to initialize client session: ${setSessionError.message}`);
          }
        } catch (error) {
          // Continue without setSession - AuthContext should handle session automatically
          console.warn('setSession failed or timed out, continuing...', error);
        }

        // Invalidate auth queries to trigger refetch
        queryClient.invalidateQueries({ queryKey: ['auth'] });

        try {
          // Verify user session with timeout
          const getUserPromise = supabaseClient.auth.getUser();
          const getUserTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('getUser timeout')), 3000)
          );

          const {
            data: { user: userAfterSetSession },
            error: getUserError,
          } = (await Promise.race([getUserPromise, getUserTimeout])) as any;

          if (getUserError || !userAfterSetSession) {
            console.warn('getUser after setSession failed or returned no user.');
          }
        } catch (error) {
          console.warn('getUser failed or timed out, continuing...', error);
        }

        // Call the external onSuccess callback if provided
        if (originalOnSuccess) {
          originalOnSuccess(response, variables, context);
        }
      } else {
        const errorData = response as ApiError;
        const errorMessage = errorData.error.message || 'Login failed due to an unknown API error.';
        throw new Error(errorMessage);
      }
    },
  });
}
