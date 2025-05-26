import { CategoryDTO } from '../category/category.dto'

export interface ProviderDTO {
  id: string
  user_id: string
  dni: string
  firstName: string
  lastName: string
  phone: string
  rating: number
  categories?: CategoryDTO[]
  districts?: any[]
}
