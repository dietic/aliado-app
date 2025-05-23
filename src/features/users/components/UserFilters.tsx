'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UserFiltersProps {
  onFilterChange: (searchQuery: string, status: 'all' | 'active' | 'inactive') => void
}

export function UserFilters({ onFilterChange }: UserFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    // Debounce search to avoid too many filter operations
    const handler = setTimeout(() => {
      onFilterChange(searchQuery, statusFilter)
    }, 300)

    return () => clearTimeout(handler)
  }, [searchQuery, statusFilter, onFilterChange])

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          type="search"
          placeholder="Buscar por nombre, email o teléfono..."
          className="w-full pl-8 focus-visible:ring-[#000041]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Select
        value={statusFilter}
        onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="inactive">Inactivos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
