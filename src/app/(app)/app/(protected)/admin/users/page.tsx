'use client'

import { useEffect, useState } from 'react'
import { UsersTable } from '@/features/users/components/UsersTable'
import { UserFilters } from '@/features/users/components/UserFilters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateUserDialog } from '@/features/users/components/CreateUserDialog'
import { PageHeader } from '@/components/app/PageHeader'
import { useGetUsers } from '@/features/users/hooks/useGetUsers'
import { useUpdateUser } from '@/features/users/hooks/useUpdateUser'
import { UserView } from '@/types/user/user.view'
import { useGetCategories } from '@/features/categories/hooks/useCategories'
import { useGetDistricts } from '@/features/districts/hooks/useGetDistricts'

export default function UsersPage() {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetUsers()
  const { data: categoriesData } = useGetCategories()
  const { data: districtsData } = useGetDistricts()

  const [users, setUsers] = useState<UserView[]>([])
  // TODO: update correct type
  const [roles, setRoles] = useState<any>([])
  const [districts, setDistricts] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [filteredUsers, setFilteredUsers] = useState<UserView[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const filterUsers = (query: string, status: 'all' | 'active' | 'inactive') => {
    setSearchQuery(query)
    setStatusFilter(status)

    let filtered = users

    if (query) {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.provider.firstName
            .concat(' ', user.provider.lastName)
            .toLowerCase()
            .includes(lowercaseQuery) ||
          user?.email?.toLowerCase().includes(lowercaseQuery) ||
          user?.provider?.phone?.includes(lowercaseQuery)
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter((user) =>
        status === 'active' ? user.status === 'active' : user.status === 'inactive'
      )
    }

    setFilteredUsers(filtered)
  }

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/roles')
      const data = await res.json()
      setRoles(data)
    } catch (err) {
      console.error('Error fetching roles:', err)
    }
  }

  // const fetchDistricts = async () => {
  //   try {
  //     const res = await fetch('/api/districts')
  //     const data = await res.json()
  //     setDistricts(data)
  //   } catch (err) {
  //     console.error('Error fetching districts:', err)
  //   }
  // }

  useEffect(() => {
    if (usersData) {
      setUsers(usersData)
    }
    if (categoriesData) {
      setCategories(categoriesData)
    }
    if (categoriesData) {
      setDistricts(districtsData)
    }
    fetchRoles()
  }, [usersData])

  const handleCreateProvider = (providerData: any) => {
    const params = providerData
    // setUsers(updatedUsers)
    // setFilteredUsers(updatedUsers)
    // setIsCreateDialogOpen(false)
  }

  // Update user status
  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive') => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: newStatus } : user
    )

    setUsers(updatedUsers)
    filterUsers(searchQuery, statusFilter)
  }

  // Delete user
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    filterUsers(searchQuery, statusFilter)
  }

  // Update user
  // const handleUpdateUser = async (updatedUser: any) => {
  //   // setUsers(updatedUsers)
  //   filterUsers(searchQuery, statusFilter)
  //   updateUser(updatedUser)
  // }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra los usuarios de la plataforma"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <UserFilters onFilterChange={(query, status) => filterUsers(query, status)} />

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-[#000041] to-[#1a1a6c] hover:from-[#000041] hover:to-[#3a3a9c] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <UsersTable
        users={filteredUsers}
        roles={roles}
        districts={districts}
        categories={categories}
        onStatusChange={handleStatusChange}
        onDeleteUser={handleDeleteUser}
      />

      <CreateUserDialog
        open={isCreateDialogOpen}
        roles={roles}
        districts={districts}
        categories={categories}
        onOpenChange={setIsCreateDialogOpen}
        onCreateUser={handleCreateProvider}
      />
    </div>
  )
}
