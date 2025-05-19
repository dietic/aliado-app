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
import { ProviderView } from '@/types/user/user.view'

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
  user: ProviderView
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateUser: (userData: User) => void
}

export function EditUserDialog({ user, open, onOpenChange, onUpdateUser }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    id: user.id,
    name: user.profile.firstName,
    email: user.email,
    phone: user.profile.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    lastLogin: user.lastLoggedIn,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form data when user changes
  useEffect(() => {
    setFormData({
      id: user.id,
      name: user.profile.firstName,
      email: user.email,
      phone: user.profile.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLoggedIn,
    })
  }, [user])

  const handleChange = (field: string, value: string | 'active' | 'inactive') => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when field is edited
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
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
      onUpdateUser(formData)
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
              <Label htmlFor="edit-name">Nombre completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
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
              <Label htmlFor="edit-role">Rol</Label>
              <Select
                value={formData?.role.slug}
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Administrador</SelectItem>
                  <SelectItem value="Usuario">Usuario</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
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
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
