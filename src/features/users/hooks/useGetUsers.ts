import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/getUsers'

export const useUsers = () => {
  return useQuery({
    queryFn: getUsers,
    queryKey: ['users'],
  })
}
