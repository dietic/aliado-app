import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { getUserByPhone } from '../api/getUser';

export const useGetUserByPhone = (
  options: UseMutationOptions<any, any, { phone: string }, any> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getUserByPhone,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
};
