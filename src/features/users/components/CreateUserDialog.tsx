'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MultiSelect } from '@/components/ui/multi-select';
import { useCreateUser } from '../hooks/useCreateUser';

interface CreateUserDialogProps {
  open: boolean;
  roles: any;
  districts: any;
  categories: any;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (userData: any) => void;
}

export function CreateUserDialog({
  open,
  roles,
  districts,
  categories,
  onOpenChange,
  onCreateUser,
}: CreateUserDialogProps) {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    status: '',
  });
  const { mutate: createUser, isPending, error } = useCreateUser();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // if (!formData.firstName.trim()) {
    //   newErrors.firstName = 'El nombre es requerido'
    // }

    // if (!formData.lastName.trim()) {
    //   newErrors.lastName = 'El apellido es requerido'
    // }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // if (!formData.phone.trim()) {
    //   newErrors.phone = 'El teléfono es requerido'
    // }

    // if (!formData.password.trim()) {
    //   newErrors.password = 'La contraseña es requerida'
    // } else if (formData.password.length < 8) {
    //   newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      email: '',
      role: '',
      status: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // onCreateUser(formData)
      createUser(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Apellidos</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div> */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div> */}

            {/* <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div> */}
            {/* <div className="grid gap-2">
              <Label htmlFor="categories" className="dark:text-slate-300">
                Servicios
              </Label>
              <MultiSelect
                options={categories}
                selected={formData.categories}
                onChange={(selected) => handleChange('categories', selected)}
                placeholder="Seleccionar servicios"
                className="dark:bg-slate-900 dark:border-slate-700"
              />
            </div> */}

            {/* <div className="grid gap-2">
              <Label htmlFor="districts" className="dark:text-slate-300">
                Distritos
              </Label>
              {districts && (
                <MultiSelect
                  options={districts}
                  selected={formData.districts}
                  onChange={(selected) => handleChange('districts', selected)}
                  placeholder="Seleccionar distritos"
                  className="dark:bg-slate-900 dark:border-slate-700"
                />
              )}
            </div> */}
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles &&
                    roles.map((rol) => (
                      <SelectItem key={rol.id} value={rol.slug}>
                        {rol.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="status">Estado activo</Label>
              <Switch
                id="status"
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
              className="border-primary text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#000041] to-[#1a1a6c] hover:from-[#000041] hover:to-[#3a3a9c] text-white"
              onClick={() => handleSubmit}
            >
              Crear Usuario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
