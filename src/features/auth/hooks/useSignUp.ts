import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signUp } from '../api/signUp'

export const useSignUp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}
