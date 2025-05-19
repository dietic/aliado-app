import { CategoryDTO } from './category'
import { DistrictDTO } from './district'

export interface ProviderDTO {
  id: string
  user_id: string
  dni: string
  firstName: string
  lastName: string
  phone: string
  rating: number
  createdAt: string
  categories?: CategoryDTO[]
  districts?: DistrictDTO[]
}
