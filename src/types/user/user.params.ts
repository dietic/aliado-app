export interface UpdateUserParams {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  roleId?: number
  isActive?: boolean
}

export interface UpdateUserStatusParams {
  id: string
  status: string
}
