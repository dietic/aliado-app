'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, UseFormReturn, Resolver } from 'react-hook-form';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { LoginApiResponse } from '@/types/auth/auth.dto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Eye, EyeOff, Lock, Phone, Loader2 } from 'lucide-react';
import { SiFacebook } from '@icons-pack/react-simple-icons';
import GoogleIcon from '@/components/shared/GoogleIcon';
import { loginSchema, LoginFormData } from '../schemas/loginSchema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  prefillPhone?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ prefillPhone }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const form: UseFormReturn<LoginFormData> = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;

  const phoneValue = watch('phone');
  const passwordValue = watch('password');

  useEffect(() => {
    if (prefillPhone) {
      setValue('phone', prefillPhone);
    }
  }, [prefillPhone, setValue]);

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: (data: LoginApiResponse) => {
      console.log('here', data);
      if (data.success && data.data && data.data.session && data.data.user) {
        toast.success('Iniciaste sesión');
        router.replace('/app');
      } else if (data.error) {
        toast.error(data.error.message || 'Credenciales inválidas');
      } else {
        toast.error('Respuesta inesperada del servidor.');
      }
    },
    onError: (error: Error) => {
      console.log('here', error);

      toast.error(error.message || 'Error interno al intentar iniciar sesión.');
    },
  });

  const handleLoginSubmitForm = useCallback(
    (formData: LoginFormData) => {
      const sanitizedData = {
        phone: formData.phone.trim(),
        password: formData.password.trim(),
      };

      loginMutate(sanitizedData);
    },
    [loginMutate]
  );

  return (
    <form onSubmit={handleSubmit(handleLoginSubmitForm)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-phone">Número de teléfono</Label>
          <div className="relative">
            <Phone
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 ${phoneValue && errors.phone ? '-translate-y-[18px]' : ''}`}
            />
            <Input
              id="login-phone"
              type="tel"
              placeholder="+51 999 999 999"
              className={`pl-10 ${errors.phone && phoneValue ? 'border-red-500 focus:ring-red-500' : ''}`}
              {...register('phone')}
              required
            />
            {phoneValue && errors.phone && (
              <div className="text-red-500 text-xs mt-1">{errors.phone.message}</div>
            )}
          </div>
        </div>

        {/* Password Input */}
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
        disabled={isPending || !phoneValue || !passwordValue || !!errors.phone} // Added isPending to disabled
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="ml-2 h-4 w-4" />
        )}
        {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
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
  );
};
