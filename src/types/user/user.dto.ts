import { ProviderDTO } from '../provider/provider.dto'
import { RoleDTO } from '../role/role.dto'

export interface UserDTO {
  id: string
  created_at: string
  role_id: string
  role?: RoleDTO
  provider?: ProviderDTO
}
