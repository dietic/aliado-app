import { useQuery } from '@tanstack/react-query'
import { getDistricts } from '../api/getDistricts'

export const useGetDistricts = () => {
  return useQuery({
    queryFn: getDistricts,
    queryKey: ['districts'],
  })
}
