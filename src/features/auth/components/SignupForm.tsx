'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Check, X, ArrowLeft, Phone } from 'lucide-react'
import Loader from '@/components/shared/Loader'
import GoogleIcon from '@/components/shared/GoogleIcon'
import { SiFacebook } from '@icons-pack/react-simple-icons'
import { useSignUp } from '@/features/auth/hooks/useSignUp'
import { usePhoneCheck } from '@/features/auth/hooks/usePhoneCheck'

// Zod schema for phone check (step 1)
const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, { message: 'Ingresa tu número de teléfono' })
    .regex(/^\+?[0-9\s]{8,15}$/, {
      message: 'Por favor ingresa un número de teléfono válido con código de país',
    }),
})
type PhoneFormData = z.infer<typeof phoneSchema>

// Zod schema for full sign-up form (step 2)
const signUpSchema = z.object({
  firstName: z.string().min(1, { message: 'Ingresa tu nombre' }),
  lastName: z.string().min(1, { message: 'Ingresa tus apellidos' }),
  email: z
    .string()
    .min(1, { message: 'Ingresa tu correo electrónico' })
    .email({ message: 'Por favor ingresa un correo electrónico válido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .refine((val) => /[0-9]/.test(val), {
      message: 'La contraseña debe incluir al menos un número',
    })
    .refine((val) => /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(val), {
      message: 'La contraseña debe incluir al menos un carácter especial',
    }),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los términos y condiciones' }),
  }),
})
type SignUpFormData = z.infer<typeof signUpSchema>

interface SignupFormProps {
  /** Callback when an entered phone already exists (triggers switch to login) */
  onPhoneExists?: (phone: string) => void
}

export const SignupForm: React.FC<SignupFormProps> = ({ onPhoneExists }) => {
  const [registrationStep, setRegistrationStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState('') // store phone after step 1 for use in step 2

  // Step 1: Phone check form
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
    watch: watchPhone,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  })
  const phoneValue = watchPhone('phone')

  // Step 2: Sign-up form
  const {
    register,
    handleSubmit: handleSignUpSubmit,
    formState: { errors },
    watch,
    reset: resetSignUpForm,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })
  const firstNameValue = watch('firstName')
  const lastNameValue = watch('lastName')
  const emailValue = watch('email')
  const passwordValue = watch('password')
  const termsChecked = watch('terms') || false

  // Derived validation flags for password rules
  const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
  const minLength = passwordValue ? passwordValue.length >= 8 : false
  const hasNumber = passwordValue ? /[0-9]/.test(passwordValue) : false
  const hasSpecialChar = passwordValue
    ? new RegExp(`[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(
        passwordValue
      )
    : false
  const passwordIsValid = minLength && hasNumber && hasSpecialChar

  const { mutate: signUpMutate, isLoading: signingUp } = useSignUp()
  const { mutateAsync: checkPhone, isLoading: checkingPhone } = usePhoneCheck()

  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  // Handle phone check form submission (Step 1)
  const handlePhoneCheckSubmit = async (data: PhoneFormData) => {
    try {
      const exists = await checkPhone(data.phone)
      if (exists) {
        // Phone already registered: switch to login form
        onPhoneExists && onPhoneExists(data.phone)
      } else {
        // Phone not registered: proceed to registration step 2
        setPhoneNumber(data.phone)
        setRegistrationStep(2)
      }
    } catch (error) {
      console.error('Phone check failed:', error)
    }
  }

  // Handle full sign-up form submission (Step 2)
  const handleSignUpSubmitForm = (data: SignUpFormData) => {
    signUpMutate({ ...data, phone: phoneNumber })
    // (On success, the useSignUp hook will handle any post-signup logic like invalidating queries)
    // You could show a confirmation or redirect the user after successful sign-up here.
  }

  // Handle returning to phone check (step 1)
  const handleBackToPhoneCheck = () => {
    setRegistrationStep(1)
    setPhoneNumber('')
    resetSignUpForm()
    // Note: we do NOT reset the phone input here, so the user can adjust it if needed
  }

  return (
    <>
      {/* <AnimatePresenceDiv mode="wait"> */}
      {registrationStep === 1 ? (
        <div
          className={`transition-all duration-300 ${
            registrationStep === 1
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-4 pointer-events-none absolute'
          }`}
        >
          <form onSubmit={handlePhoneSubmit(handlePhoneCheckSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="check-phone" className="dark:text-slate-200">
                Número de teléfono
              </Label>
              <div className="relative">
                <Phone
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 ${phoneValue && phoneErrors.phone ? '-translate-y-[110%]' : ''}`}
                />
                <Input
                  id="check-phone"
                  type="tel"
                  placeholder="+51 999 999 999"
                  className={`pl-10 ${phoneValue && phoneErrors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  {...registerPhone('phone')}
                  required
                />
                {phoneValue && phoneErrors.phone && (
                  <div className="text-red-500 text-xs mt-1">{phoneErrors.phone.message}</div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa tu número con código de país para verificar si ya tienes una cuenta
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white"
              disabled={checkingPhone || !phoneValue || !!phoneErrors.phone}
            >
              {checkingPhone ? (
                <span className="flex items-center">
                  <Loader className="mr-2" /> Verificando...
                </span>
              ) : (
                <span className="flex items-center">
                  Continuar <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div
          className={`transition-all duration-300 ${
            registrationStep === 2
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-4 pointer-events-none absolute'
          }`}
        >
          <div className="mb-6">
            <button
              type="button"
              onClick={handleBackToPhoneCheck}
              className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Volver
            </button>
          </div>
          <form onSubmit={handleSignUpSubmit(handleSignUpSubmitForm)} className="space-y-6">
            <div className="space-y-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre(s)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    className="pl-10"
                    {...register('firstName')}
                    required
                  />
                </div>
              </div>
              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Tu nombre"
                    className="pl-10"
                    {...register('lastName')}
                    required
                  />
                </div>
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="signup-email">Correo electrónico</Label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 ${emailValue && errors.email ? '-translate-y-4' : ''}`}
                  />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@correo.com"
                    className={`pl-10 ${emailValue && errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    {...register('email')}
                    required
                  />
                  {emailValue && errors.email && (
                    <div className="text-red-500 text-xs mt-1">{errors.email.message}</div>
                  )}
                </div>
              </div>
              {/* Phone (read-only, from step 1) */}
              <div className="space-y-2">
                <Label htmlFor="phone">Número de teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+51 999 999 999"
                    className="pl-10 bg-slate-50"
                    value={phoneNumber}
                    readOnly
                  />
                </div>
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="signup-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${passwordValue && !passwordIsValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                    {...register('password')}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password strength indicators */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center">
                    {minLength ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <p className={`text-xs ${minLength ? 'text-green-600' : 'text-slate-500'}`}>
                      Mínimo 8 caracteres
                    </p>
                  </div>
                  <div className="flex items-center">
                    {hasNumber ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <p className={`text-xs ${hasNumber ? 'text-green-600' : 'text-slate-500'}`}>
                      Al menos un número
                    </p>
                  </div>
                  <div className="flex items-center">
                    {hasSpecialChar ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <p
                      className={`text-xs ${hasSpecialChar ? 'text-green-600' : 'text-slate-500'}`}
                    >
                      Al menos un carácter especial (!@#$%^&*...)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" {...register('terms')} required />
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
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white"
              disabled={
                signingUp ||
                !passwordIsValid ||
                !!(emailValue && errors.email) ||
                !firstNameValue ||
                !lastNameValue ||
                !emailValue ||
                !passwordValue ||
                !termsChecked
              }
            >
              Crear cuenta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

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
          className="w-full border-slate-200 hover:border-primary hover:text-primary dark:bg-slate-700 dark:border-none dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <SiFacebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </>
  )
}
