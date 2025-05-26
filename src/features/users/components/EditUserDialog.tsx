'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { RoleView } from '@/types/role/role.view'
import { UserView } from '@/types/user/user.view'
import { useUpdateUser } from '../hooks/useUpdateUser'
import Loader from '@/components/shared/Loader'
import { MultiSelect } from '@/components/ui/multi-select'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin: string
}

interface EditUserDialogProps {
  user: UserView
  roles: RoleView[]
  categories: any[]
  districts: any[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({
  user,
  open,
  roles,
  districts,
  categories,
  onOpenChange,
}: EditUserDialogProps) {
  const { mutate: updateUser, isPending, error: updateUserError } = useUpdateUser()
  const [formData, setFormData] = useState({
    id: user.id,
    firstName: user.provider.firstName,
    lastName: user.provider.lastName,
    email: user.email,
    phone: user.provider.phone,
    role: user.role.slug,
    status: user.status,
    districts: user.provider.districts,
    categories: user.provider.categories,
    createdAt: user.createdAt,
    lastLogin: user.lastLoggedIn,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  useEffect(() => {
    setFormData({
      id: user?.id,
      firstName: user?.provider?.firstName,
      lastName: user?.provider?.lastName,
      email: user?.email,
      phone: user?.provider?.phone,
      role: user?.role?.slug,
      status: user?.status,
      districts: user.provider.districts,
      categories: user.provider.categories,
      createdAt: user?.createdAt,
      lastLogin: user?.lastLoggedIn,
    })
  }, [user])

  const handleChange = (field: string, value: string | 'active' | 'inactive') => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      updateUser(formData)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>Actualiza la información del usuario.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre(s)</Label>
              <Input
                id="edit-name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-name">Apellidos</Label>
              <Input
                id="edit-name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Teléfono</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categories" className="dark:text-slate-300">
                Servicios
              </Label>
              <MultiSelect
                options={categories}
                selected={formData.categories || []}
                onChange={(selected) => handleChange('categories', selected)}
                placeholder="Seleccionar servicios"
                className="dark:bg-slate-900 dark:border-slate-700"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="districts" className="dark:text-slate-300">
                Distritos
              </Label>
              {districts && (
                <MultiSelect
                  options={districts}
                  selected={formData.districts || []}
                  onChange={(selected) => handleChange('districts', selected)}
                  placeholder="Seleccionar distritos"
                  className="dark:bg-slate-900 dark:border-slate-700"
                />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Rol</Label>
              <Select value={formData?.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles &&
                    roles.map((role) => (
                      <SelectItem value={role.slug} key={role.slug}>
                        {role.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="edit-status">Estado activo</Label>
              <Switch
                id="edit-status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) =>
                  handleChange('status', checked ? 'active' : 'inactive')
                }
                className="data-[state=checked]:bg-[#000041]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              className=" border-primary text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#000041] to-[#1a1a6c] hover:from-[#000041] hover:to-[#3a3a9c] text-white"
              disabled={Object.keys(errors).length > 0 || isPending}
            >
              {isPending ? (
                <span className="flex items-center">
                  <Loader />
                  Actualizando...
                </span>
              ) : (
                <span className="flex items-center">Continuar</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
