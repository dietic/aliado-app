import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { signUp } from '../api/signUp';

export const useSignUp = (options: UseMutationOptions<any, any, { phone: string }, any> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
};
