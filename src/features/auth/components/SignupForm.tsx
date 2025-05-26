'use client'

import React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Check, X, ArrowLeft, Phone } from 'lucide-react'
import Loader from '@/components/shared/Loader'
import GoogleIcon from '@/components/shared/GoogleIcon'
import { SiFacebook } from '@icons-pack/react-simple-icons'

interface SignupProps {
  registrationStep: number
  phone: string
  isPhoneValid: boolean
  isCheckingPhone: boolean
  firstName: string
  lastName: string
  email: string
  password: string
  isEmailValid: boolean
  showPassword: boolean
  passwordValidation: {
    minLength: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
    isValid: boolean
  }
  handlePhoneCheck: (e: React.FormEvent) => void
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSignupSubmit: (e: React.FormEvent) => void
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  togglePasswordVisibility: () => void
  setFirstName: React.Dispatch<React.SetStateAction<string>>
  setLastName: React.Dispatch<React.SetStateAction<string>>
  handleBackToPhoneCheck: () => void
}

export const SignupForm: React.FC<SignupProps> = ({
  registrationStep,
  phone,
  isPhoneValid,
  isCheckingPhone,
  firstName,
  lastName,
  email,
  password,
  isEmailValid,
  showPassword,
  passwordValidation,
  handlePhoneCheck,
  handlePhoneChange,
  handleSignupSubmit,
  handleEmailChange,
  handlePasswordChange,
  togglePasswordVisibility,
  setFirstName,
  setLastName,
  handleBackToPhoneCheck,
}) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {registrationStep === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handlePhoneCheck} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="check-phone" className="dark:text-slate-200">
                  Número de teléfono
                </Label>
                <div className="relative">
                  <Phone
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 ${phone && !isPhoneValid ? '-translate-y-[110%]' : ''}`}
                  />
                  <Input
                    id="check-phone"
                    type="tel"
                    placeholder="+51 999 999 999"
                    className={`pl-10 ${!isPhoneValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                  {phone && !isPhoneValid && (
                    <div className="text-red-500 text-xs mt-1">
                      Por favor ingresa un número de teléfono válido con código de país
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Ingresa tu número con código de país para verificar si ya tienes una cuenta
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white"
                disabled={isCheckingPhone || !phone || !isPhoneValid}
              >
                {isCheckingPhone ? (
                  <span className="flex items-center">
                    <Loader />
                    Verificando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Continuar <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <button
                onClick={handleBackToPhoneCheck}
                className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1 cursor-pointer" /> Volver
              </button>
            </div>
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre(s)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Tu nombre"
                      className="pl-10"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Apellidos</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Tu nombre"
                      className="pl-10"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 ${email && !isEmailValid ? '-translate-y-4' : ''}`}
                    />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@correo.com"
                      className={`pl-10 ${!isEmailValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                      required
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {email && !isEmailValid && (
                      <div className="text-red-500 text-xs mt-1">
                        Por favor ingresa un correo electrónico válido
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Número de teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+51 999 999 999"
                      className="pl-10 bg-slate-50"
                      required
                      value={phone}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${
                        password && !passwordValidation.isValid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                      required
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      {passwordValidation.minLength ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <p
                        className={`text-xs ${
                          passwordValidation.minLength ? 'text-green-600' : 'text-slate-500'
                        }`}
                      >
                        Mínimo 8 caracteres
                      </p>
                    </div>

                    <div className="flex items-center">
                      {passwordValidation.hasNumber ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <p
                        className={`text-xs ${
                          passwordValidation.hasNumber ? 'text-green-600' : 'text-slate-500'
                        }`}
                      >
                        Al menos un número
                      </p>
                    </div>

                    <div className="flex items-center">
                      {passwordValidation.hasSpecialChar ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <p
                        className={`text-xs ${
                          passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-slate-500'
                        }`}
                      >
                        Al menos un carácter especial (!@#$%^&*...)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400">
                  Acepto los{' '}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline dark:text-slate-100 dark:hover:text-slate-300"
                  >
                    términos y condiciones
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white"
                disabled={
                  !passwordValidation.isValid ||
                  !isEmailValid ||
                  !firstName ||
                  !lastName ||
                  !email ||
                  !password
                }
                onClick={handleSignupSubmit}
              >
                Crear cuenta <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>{' '}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-500">
            O regístrate con
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
          className="w-full border-slate-200 hover:border-primary hover:text-primary d dark:bg-slate-700 dark:border-none dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <SiFacebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </>
  )
}
