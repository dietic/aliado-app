import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, Eye, EyeOff, Lock, Phone } from 'lucide-react'
import { SiFacebook } from '@icons-pack/react-simple-icons'
import GoogleIcon from '../shared/GoogleIcon'

interface LoginProps {
  loginPhone: string
  loginPassword: string
  showPassword: boolean
  isLoginPhoneValid: boolean
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  togglePasswordVisibility: () => void
  handleLoginSubmit: (e: React.FormEvent) => void
}

export const Login: React.FC<LoginProps> = (
  {
    // loginPhone,
    // loginPassword,
    // showPassword,
    // isLoginPhoneValid,
    // onPhoneChange,
    // onPasswordChange,
    // togglePasswordVisibility,
    // handleLoginSubmit,
  }
) => {
  const [loginPhone, setLoginPhone] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoginPhoneValid, setIsLoginPhoneValid] = useState(true)
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9\s]{8,15}$/
    return phoneRegex.test(phone)
  }
  const isPhoneOk = phone && validatePhone(phone)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const handleLoginPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLoginPhone(value)
    if (value) {
      setIsLoginPhoneValid(validatePhone(value))
    } else {
      setIsLoginPhoneValid(true) // Don't show error for empty field
    }
  }
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate phone
    const isPhoneOk = loginPhone && validatePhone(loginPhone)
    setIsLoginPhoneValid(isPhoneOk)

    // If validation passes
    if (isPhoneOk && loginPassword) {
      // Form is valid, proceed with submission
      console.log('Login attempted', { phone: loginPhone, password: loginPassword })
      // Here you would typically call an API to authenticate the user

      // For demo purposes, show success if the demo credentials are used
      if (loginPhone === '+51 999 999 999' && loginPassword === 'password123!') {
        alert('Inicio de sesión exitoso!')
      } else {
        alert('Credenciales incorrectas. Intenta nuevamente.')
      }
    }
  }
  return (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-phone">Número de teléfono</Label>
          <div className="relative">
            <Phone
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 ${loginPhone && !isLoginPhoneValid ? '-translate-y-[18px]' : ''}`}
            />
            <Input
              id="login-phone"
              type="tel"
              placeholder="+51 999 999 999"
              className={`pl-10 ${!isLoginPhoneValid ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
              value={loginPhone}
              onChange={handleLoginPhoneChange}
            />
            {loginPhone && !isLoginPhoneValid && (
              <div className="text-red-500 text-xs mt-1">
                Por favor ingresa un número de teléfono válido con código de país
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="login-password">Contraseña</Label>
            <Link
              href="/auth/reset-password"
              className="text-xs text-slate-500 hover:text-primary transition-colors dark:hover:text-slate-300"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-sm text-slate-500">
          Recordar mi sesión
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white"
        disabled={!loginPhone || !loginPassword || !isLoginPhoneValid}
      >
        Iniciar sesión <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-500">
            O continúa con
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="w-full border-slate-200 hover:border-primary hover:text-primary dark:bg-slate-700 dark:border-none dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <GoogleIcon />
          Google
        </Button>
        <Button
          variant="outline"
          className="w-full border-slate-200 hover:border-primary hover:text-primary dark:bg-slate-700 dark:border-none dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <SiFacebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </form>
  )
}
