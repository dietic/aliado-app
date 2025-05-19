'use client'

import { useEffect, useState } from 'react'
import { UsersTable } from '@/components/shared/app/admin/users/UsersTable'
import { UserFilters } from '@/components/shared/app/admin/users/UserFilters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateUserDialog } from '@/components/shared/app/admin/users/CreateUserDialog'
import { PageHeader } from '@/components/shared/app/PageHeader'
import { ProviderView } from '@/types/user/user.view'

export default function UsersPage() {
  const [users, setUsers] = useState<ProviderView[]>([])
  const [filteredUsers, setFilteredUsers] = useState<ProviderView[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Filter users based on search query and status
  const filterUsers = (query: string, status: 'all' | 'active' | 'inactive') => {
    setSearchQuery(query)
    setStatusFilter(status)

    let filtered = users

    if (query) {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.profile.firstName
            .concat(' ', user.profile.lastName)
            .toLowerCase()
            .includes(lowercaseQuery) ||
          user?.email?.toLowerCase().includes(lowercaseQuery) ||
          user?.profile?.phone?.toLowerCase().includes(lowercaseQuery)
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter((user) =>
        status === 'active' ? user.status === 'active' : user.status === 'inactive'
      )
    }

    setFilteredUsers(filtered)
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      console.log('data', data)
      setUsers(data)
      setFilteredUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Create a new user
  const handleCreateUser = (userData: any) => {
    const newUser = {
      id: (users.length + 1).toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: '-',
    }

    const updatedUsers = [...users, newUser]
    // setUsers(updatedUsers)
    // setFilteredUsers(updatedUsers)
    setIsCreateDialogOpen(false)
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
  const handleUpdateUser = (updatedUser: any) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    )

    setUsers(updatedUsers)
    filterUsers(searchQuery, statusFilter)
  }

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
        onStatusChange={handleStatusChange}
        onDeleteUser={handleDeleteUser}
        onUpdateUser={handleUpdateUser}
      />

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateUser={handleCreateUser}
      />
    </div>
  )
}
