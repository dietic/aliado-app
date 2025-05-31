'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  User,
  Check,
  X,
  ArrowLeft,
  Phone,
} from 'lucide-react';
import Loader from '@/components/shared/Loader';
import { useSignUp } from '@/features/auth/hooks/useSignUp';
import { PASSWORD_SPECIAL_CHARS, PASSWORD_MIN_LENGTH, RegistrationStep } from '@/constants/misc';
import { SignUpFormData, signUpSchema } from '../../schemas/signupSchema';
import { PhoneCheckForm } from './PhoneCheckForm';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface PasswordValidation {
  minLength: boolean;
  hasNumber: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
}

// Custom hooks
const usePasswordValidation = (password: string): PasswordValidation => {
  return useMemo(() => {
    if (!password) {
      return {
        minLength: false,
        hasNumber: false,
        hasLowercase: false,
        hasUppercase: false,
        hasSpecialChar: false,
      };
    }

    const specialCharsRegex = new RegExp(
      `[${PASSWORD_SPECIAL_CHARS.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`
    );

    return {
      minLength: password.length >= PASSWORD_MIN_LENGTH,
      hasNumber: /[0-9]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: specialCharsRegex.test(password),
    };
  }, [password]);
};

export const SignupForm: React.FC = () => {
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>(
    RegistrationStep.PHONE_CHECK
  );
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: signUpMutate, isPending: signingUp } = useSignUp({
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.message || 'Cuenta creada exitosamente');
        router.replace('/app/auth?mode=login');
      } else {
        toast.error(data.error.message);
      }
    },
    onError: (err) => {
      toast.error(`Internal error`);
    },
  });

  // Sign-up form
  const {
    register,
    handleSubmit: handleSignUpSubmit,
    formState: { errors, isValid },
    watch,
    reset: resetSignUpForm,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    // resolver: undefined,
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      terms: false,
    },
  });

  // Watched values
  const formValues = watch();
  const passwordValidation = usePasswordValidation(formValues.password || '');

  // Computed values
  const isPasswordValid = useMemo(() => {
    return Object.values(passwordValidation).every(Boolean);
  }, [passwordValidation]);

  const isSignUpFormValid = useMemo(() => {
    return (
      // isValid &&
      isPasswordValid &&
      formValues.firstName &&
      formValues.lastName &&
      formValues.email &&
      formValues.password &&
      formValues.terms
    );
  }, [isValid, isPasswordValid, formValues]);

  // Event handlers
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSignUpSubmitForm = useCallback(
    (data: SignUpFormData) => {
      // Sanitize data before sending
      const sanitizedData = {
        ...data,
        phone: data.phone.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
      };

      signUpMutate(sanitizedData);
    },
    [signUpMutate]
  );

  const handleBackToPhoneCheck = useCallback(() => {
    setRegistrationStep(RegistrationStep.PHONE_CHECK);
    resetSignUpForm();
  }, [resetSignUpForm]);

  const handleTermsChange = useCallback(
    (checked: boolean) => {
      setValue('terms', checked, { shouldValidate: true });
    },
    [setValue]
  );

  // Render phone check step
  if (registrationStep === RegistrationStep.PHONE_CHECK) {
    return (
      <>
        <PhoneCheckForm setRegistrationStep={setRegistrationStep} setPhoneValue={setValue} />
      </>
    );
  }

  // Render sign-up form step
  return (
    <div className="transition-all duration-300 opacity-100 translate-x-0">
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBackToPhoneCheck}
          className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
          disabled={signingUp}
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
                className={`pl-10 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...register('firstName')}
                autoComplete="given-name"
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              {errors.firstName && (
                <div id="firstName-error" className="text-red-500 text-xs mt-1" role="alert">
                  {errors.firstName.message}
                </div>
              )}
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
                placeholder="Tus apellidos"
                className={`pl-10 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...register('lastName')}
                autoComplete="family-name"
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
              {errors.lastName && (
                <div id="lastName-error" className="text-red-500 text-xs mt-1" role="alert">
                  {errors.lastName.message}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="signup-email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="signup-email"
                type="email"
                placeholder="tu@correo.com"
                className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...register('email')}
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <div id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                  {errors.email.message}
                </div>
              )}
            </div>
          </div>

          {/* Phone (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="phone">Número de teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+51 999 999 999"
                className="pl-10 bg-slate-50 dark:bg-slate-800"
                readOnly
                tabIndex={-1}
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
                className={`pl-10 pr-10 ${
                  formValues.password && !isPasswordValid ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                {...register('password')}
                autoComplete="new-password"
                aria-describedby="password-requirements"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password strength indicators */}
            <div id="password-requirements" className="mt-2 space-y-1">
              <PasswordStrengthIndicator
                label="Mínimo 8 caracteres"
                isValid={passwordValidation.minLength}
              />
              <PasswordStrengthIndicator
                label="Al menos un número"
                isValid={passwordValidation.hasNumber}
              />
              <PasswordStrengthIndicator
                label="Al menos una letra minúscula"
                isValid={passwordValidation.hasLowercase}
              />
              <PasswordStrengthIndicator
                label="Al menos una letra mayúscula"
                isValid={passwordValidation.hasUppercase}
              />
              <PasswordStrengthIndicator
                label="Al menos un carácter especial"
                isValid={passwordValidation.hasSpecialChar}
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formValues.terms}
            onCheckedChange={handleTermsChange}
            aria-describedby="terms-error"
            className="mt-1"
          />
          <div className="space-y-1">
            <Label
              htmlFor="terms"
              className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer"
            >
              Acepto los{' '}
              <Link
                href="/terms"
                className="text-primary hover:underline dark:text-slate-100 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                términos y condiciones
              </Link>
            </Label>
            {errors.terms && (
              <div id="terms-error" className="text-red-500 text-xs" role="alert">
                {errors.terms.message}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={signingUp || !isSignUpFormValid}
        >
          {signingUp ? (
            <span className="flex items-center">
              <Loader className="mr-2" /> Creando cuenta...
            </span>
          ) : (
            <span className="flex items-center">
              Crear cuenta <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};
