'use client'

import type React from 'react'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { useSearchParams } from 'next/navigation'
import { useSignUp } from '@/features/auth/hooks/useSignUp'

export default function Auth() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') // 'login' or 'signup'

  const { mutate, error } = useSignUp()

  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(mode || 'login')
  const [registrationStep, setRegistrationStep] = useState(1) // Step 1: Phone check, Step 2: Full registration

  // Form values
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loginPhone, setLoginPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Validation states
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPhoneValid, setIsPhoneValid] = useState(true)
  const [isLoginPhoneValid, setIsLoginPhoneValid] = useState(true)
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
  })

  // Phone check state
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)
  const [phoneExists, setPhoneExists] = useState(false)

  // Special characters allowed
  const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate phone format (basic international format)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9\s]{8,15}$/
    return phoneRegex.test(phone)
  }

  // Validate password against requirements
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = new RegExp(
      `[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`
    ).test(password)

    setPasswordValidation({
      minLength,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasNumber && hasSpecialChar,
    })
  }

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value) {
      setIsEmailValid(validateEmail(value))
    } else {
      setIsEmailValid(true) // Don't show error for empty field
    }
  }

  // Handle phone change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    if (value) {
      setIsPhoneValid(validatePhone(value))
    } else {
      setIsPhoneValid(true) // Don't show error for empty field
    }
  }

  // Handle login phone change
  const handleLoginPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLoginPhone(value)
    if (value) {
      setIsLoginPhoneValid(validatePhone(value))
    } else {
      setIsLoginPhoneValid(true) // Don't show error for empty field
    }
  }

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  // Handle phone check submission
  const handlePhoneCheck = (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone || !validatePhone(phone)) {
      setIsPhoneValid(false)
      return
    }

    setIsCheckingPhone(true)

    // Simulate API call to check if phone exists
    setTimeout(() => {
      // For demo purposes, let's say +51 999 999 999 is already registered
      const exists = phone === '+51 999 999 999'
      setPhoneExists(exists)

      if (exists) {
        // If phone exists, switch to login tab and pre-fill the phone
        setActiveTab('login')
        setLoginPhone(phone)
      } else {
        // If phone doesn't exist, proceed to registration step 2
        setRegistrationStep(2)
      }

      setIsCheckingPhone(false)
    }, 1000)
  }

  // Handle signup form submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const isEmailOk = email && validateEmail(email)
    const isPhoneOk = phone && validatePhone(phone)
    const isPasswordOk = passwordValidation.isValid

    // Update validation states
    setIsEmailValid(isEmailOk)
    setIsPhoneValid(isPhoneOk)

    // If all validations pass
    if (isEmailOk && isPhoneOk && isPasswordOk) {
      // Form is valid, proceed with submission
      // console.log('Form submitted successfully', { name, email, phone, password })
      // Here you would typically call an API to register the user
      // For demo purposes, show success
      // alert('Cuenta creada exitosamente!')
      mutate({ email, password, firstName, lastName, phone })
    } else {
      // console.log('Form has validation errors')
    }
  }

  // Handle login form submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate phone
    const isPhoneOk = loginPhone && validatePhone(loginPhone)
    setIsLoginPhoneValid(isPhoneOk)

    // If validation passes
    if (isPhoneOk && loginPassword) {
      // Form is valid, proceed with submission
      // console.log('Login attempted', { phone: loginPhone, password: loginPassword })
      // Here you would typically call an API to authenticate the user

      // For demo purposes, show success if the demo credentials are used
      if (loginPhone === '+51 999 999 999' && loginPassword === 'password123!') {
        alert('Inicio de sesión exitoso!')
      } else {
        alert('Credenciales incorrectas. Intenta nuevamente.')
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Reset registration form when going back to step 1
  const handleBackToPhoneCheck = () => {
    setRegistrationStep(1)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setPasswordValidation({
      minLength: false,
      hasNumber: false,
      hasSpecialChar: false,
      isValid: false,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#1a1a6c] rounded-full blur-3xl opacity-5"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#3a3a9c] rounded-full blur-3xl opacity-5"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Bienvenido a Aliado
                </h1>
                <p className="text-slate-500">Inicia sesión o crea una cuenta para continuar</p>
              </div>

              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-8 w-full">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 cursor-pointer"
                  >
                    Iniciar sesión
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 cursor-pointer"
                    onClick={() => setRegistrationStep(1)}
                  >
                    Crear cuenta
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm
                    loginPhone={loginPhone}
                    loginPassword={loginPassword}
                    showPassword={showPassword}
                    isLoginPhoneValid={isLoginPhoneValid}
                    onPhoneChange={handleLoginPhoneChange}
                    onPasswordChange={(e) => setLoginPassword(e.target.value)}
                    togglePasswordVisibility={togglePasswordVisibility}
                    handleLoginSubmit={handleLoginSubmit}
                  />
                </TabsContent>

                <TabsContent value="signup">
                  <SignupForm
                    registrationStep={registrationStep}
                    phone={phone}
                    isPhoneValid={isPhoneValid}
                    isCheckingPhone={isCheckingPhone}
                    firstName={firstName}
                    lastName={lastName}
                    email={email}
                    password={password}
                    isEmailValid={isEmailValid}
                    showPassword={showPassword}
                    passwordValidation={passwordValidation}
                    handlePhoneCheck={handlePhoneCheck}
                    handlePhoneChange={handlePhoneChange}
                    handleSignupSubmit={handleSignupSubmit}
                    handleEmailChange={handleEmailChange}
                    handlePasswordChange={handlePasswordChange}
                    togglePasswordVisibility={togglePasswordVisibility}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    handleBackToPhoneCheck={handleBackToPhoneCheck}
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-slate-500">
                {activeTab === 'login' ? (
                  <p>
                    ¿No tienes una cuenta?{' '}
                    <button
                      onClick={() => {
                        setActiveTab('signup')
                        setRegistrationStep(1)
                      }}
                      className="text-primary font-medium hover:underline dark:text-slate-300 dark:hover:text-slate-100"
                    >
                      Regístrate
                    </button>
                  </p>
                ) : (
                  <p>
                    ¿Ya tienes una cuenta?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-primary font-medium hover:underline dark:text-slate-300 dark:hover:text-slate-100"
                    >
                      Inicia sesión
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Aliado. Todos los derechos reservados.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
