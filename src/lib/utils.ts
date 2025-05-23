import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (dateString === '-') return '-'

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (error) {
    return dateString
  }
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, g) => g.toUpperCase())
}

export function objSnakeToCamel<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => objSnakeToCamel(item)) as T
  }

  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key)
      result[camelKey] = objSnakeToCamel(value)
    }

    return result as T
  }

  return obj
}
