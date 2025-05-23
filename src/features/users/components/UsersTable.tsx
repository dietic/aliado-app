'use client'

import { Provider, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { formatDate } from '@/lib/utils'
import { ProviderView } from '@/types/user/user.view'
import { EditUserDialog } from './EditUserDialog'
import { RoleView } from '@/types/role/role.view'

interface UsersTableProps {
  users: ProviderView[]
  roles: RoleView[]
  onStatusChange: (userId: string, status: 'active' | 'inactive') => void
  onDeleteUser: (userId: string) => void
  onUpdateUser: (user: ProviderView) => void
}

export function UsersTable({
  users,
  roles,
  onStatusChange,
  onDeleteUser,
  onUpdateUser,
}: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<ProviderView | null>(null)
  const [userToDelete, setUserToDelete] = useState<ProviderView | null>(null)

  const handleStatusToggle = (userId: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    onStatusChange(userId, newStatus)
  }

  return (
    <div className="rounded-md border bg-white dark:bg-slate-800 dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="dark:border-slate-700">
            <TableHead className="dark:text-slate-300">Nombre</TableHead>
            <TableHead className="dark:text-slate-300">Email</TableHead>
            <TableHead className="dark:text-slate-300">Teléfono</TableHead>
            <TableHead className="dark:text-slate-300">Rol</TableHead>
            <TableHead className="dark:text-slate-300">Estado</TableHead>
            <TableHead className="dark:text-slate-300">Creado</TableHead>
            <TableHead className="dark:text-slate-300">Último Acceso</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center dark:text-slate-400 dark:border-slate-700"
              >
                No se encontraron usuarios.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="dark:border-slate-700">
                <TableCell className="font-medium dark:text-white">
                  {user?.profile?.firstName || '--'}
                </TableCell>
                <TableCell className="dark:text-slate-300">{user?.email}</TableCell>
                <TableCell className="dark:text-slate-300">{user?.profile?.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.role.slug === 'admin'
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-slate-200 text-slate-700 dark:border-slate-600 dark:text-slate-300'
                    }
                  >
                    {user.role.name} {user.role.slug === 'admin' ? '👾' : '👷🏻'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={user.status === 'active'}
                      onCheckedChange={() => handleStatusToggle(user.id, user?.status)}
                      className="data-[state=checked]:bg-[#000041]"
                    />
                    <span
                      className={
                        user.status === 'active'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }
                    >
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="dark:text-slate-300">{formatDate(user.createdAt)}</TableCell>
                <TableCell className="dark:text-slate-300">
                  {!user.lastLoggedIn ? '-' : formatDate(user.lastLoggedIn)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingUser(user)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setUserToDelete(user)}
                        className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          roles={roles}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onUpdateUser={(updatedUser) => {
            onUpdateUser(updatedUser)
            // setEditingUser(null)
          }}
        />
      )}

      {/* {userToDelete && (
        <DeleteUserDialog
          user={userToDelete}
          open={!!userToDelete}
          onOpenChange={(open) => !open && setUserToDelete(null)}
          onConfirm={() => {
            onDeleteUser(userToDelete.id)
            setUserToDelete(null)
          }}
        />
      )} */}
    </div>
  )
}
