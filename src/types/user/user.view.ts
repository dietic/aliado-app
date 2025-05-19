import { ProviderDTO } from '../provider/provider.dto'
import { RoleDTO } from '../role/role.dto'

export interface ProviderView {
  id: string
  role: RoleDTO
  profile: ProviderDTO
  email: string | null
  status: string
  createdAt: string | null
  updatedAt: string | null
  lastLoggedIn: string | null
}
