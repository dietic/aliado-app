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
  slug: string
  name: string
}

interface MultiSelectProps {
  options: OptionType[]
  selected: string[]
  onChange: (selected: string[]) => void
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

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  // Handle wheel events to enable mouse wheel scrolling with smooth behavior
  const handleWheel = (event: React.WheelEvent) => {
    // Prevent the default behavior to avoid page scrolling
    event.stopPropagation()

    // Get the scrollable element (CommandGroup)
    const scrollContainer = commandListRef.current?.querySelector('.overflow-y-auto')

    if (scrollContainer) {
      // Use smooth scrolling with scrollTo instead of directly modifying scrollTop
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
                key={item}
                className="mr-1 mb-1 pr-1 flex items-center gap-1 bg-slate-800 dark:bg-primary"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <span className="truncate">
                  {options.find((option) => option.slug === item)?.name || item}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(item)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleUnselect(item)
                    }
                  }}
                  aria-label={`Remove ${options.find((option) => option.slug === item)?.name || item}`}
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
                <CommandItem key={option.slug} onSelect={() => handleSelect(option.slug)}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(option.slug) ? 'opacity-100' : 'opacity-0'
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
