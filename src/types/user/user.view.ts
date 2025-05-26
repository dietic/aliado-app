import { ProviderDTO } from '../provider/provider.dto'
import { RoleDTO } from '../role/role.dto'

export interface UserView {
  id: string
  role: RoleDTO
  provider: ProviderDTO
  email: string
  status: 'active' | 'inactive'
  createdAt: string
  lastLoggedIn: string
}
