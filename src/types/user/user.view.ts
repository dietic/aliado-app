import { ProviderDTO } from '../provider/provider.dto'
import { RoleDTO } from '../role/role.dto'

export interface ProviderView {
  id: string
  role: RoleDTO
  profile: ProviderDTO
  email: string | null
  status: 'active' | 'inactive'
  createdAt: string
  lastLoggedIn: string | null
}
