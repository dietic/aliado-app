// features/auth/hooks/useLogin.ts
import { useState } from 'react'

/**
 * Simulates a login process.
 * Replace with a real authentication call.
 */
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = (phone: string, password: string) => {
    setIsLoading(true)
    setError(null)
    setTimeout(() => {
      setIsLoading(false)
      if (phone === '+51 999 999 999' && password === 'password123!') {
        alert('Inicio de sesión exitoso!')
      } else {
        setError('Credenciales incorrectas. Intenta nuevamente.')
        alert('Credenciales incorrectas. Intenta nuevamente.')
      }
    }, 900)
  }

  return { login, isLoading, error }
}
