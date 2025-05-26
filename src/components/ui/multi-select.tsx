'use client'

import * as React from 'react'
import { X, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export type OptionType = {
  id: string
  slug: string
  name: string
}

interface MultiSelectProps {
  options: OptionType[]
  selected: OptionType[]
  onChange: (selected: OptionType[]) => void
  placeholder?: string
  className?: string
  emptyMessage?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Seleccionar opciones',
  className,
  emptyMessage = 'No se encontraron resultados.',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const commandListRef = React.useRef<HTMLDivElement>(null)
  const handleUnselect = (itemId: string) => {
    onChange(selected.filter((item) => item.id !== itemId))
  }

  const handleSelect = (id: string) => {
    const alreadySelected = selected.some((item) => item.id === id)
    if (alreadySelected) {
      onChange(selected.filter((item) => item.id !== id))
    } else {
      const matched = options.find((option) => option.id === id)
      if (matched) onChange([...selected, matched])
    }
  }

  const handleWheel = (event: React.WheelEvent) => {
    event.stopPropagation()
    const scrollContainer = commandListRef.current?.querySelector('.overflow-y-auto')
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop + event.deltaY,
        behavior: 'smooth',
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            selected.length > 0 ? 'h-auto' : 'h-10',
            'dark:hover:bg-transparent',
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 && placeholder}
            {selected.map((item) => (
              <Badge
                variant="secondary"
                key={item.id}
                className="mr-1 mb-1 pr-1 flex items-center gap-1 bg-slate-800 dark:bg-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="truncate">{item.name}</span>
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(item.id)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleUnselect(item.id)
                    }
                  }}
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </span>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ maxHeight: 'var(--radix-popover-content-available-height)' }}
        onWheel={handleWheel}
      >
        <Command className="w-full max-h-full overflow-hidden">
          <CommandInput placeholder="Buscar..." />
          <CommandList ref={commandListRef}>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto scrollbar-thin smooth-scroll">
              {options.map((option) => (
                <CommandItem key={option.id} onSelect={() => handleSelect(option.id)}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.some((s) => s.id === option.id) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
