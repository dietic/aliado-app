import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/getUsers'

export const useGetUsers = () => {
  return useQuery({
    queryFn: getUsers,
    queryKey: ['users'],
  })
}
