// features/auth/hooks/usePhoneCheck.ts
import { useCallback, useState } from 'react'

/**
 * Simulates checking if a phone number already exists.
 * Replace with a real API call as needed.
 * Returns a mutation function and loading state.
 */
export function usePhoneCheck() {
  const [isLoading, setIsLoading] = useState(false)

  // You can replace this with a real API call
  const mutateAsync = useCallback(async (phone: string) => {
    setIsLoading(true)
    // Demo: this phone number always "exists", others do not
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsLoading(false)
    return phone === '+51 999 999 999'
  }, [])

  return { mutateAsync, isLoading }
}
