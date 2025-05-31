'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Eye, EyeOff, Lock, Phone, Loader2 } from 'lucide-react';
import { SiFacebook } from '@icons-pack/react-simple-icons';
import GoogleIcon from '@/components/shared/GoogleIcon';
import { LoginFormData, loginSchema } from '../schemas/loginSchema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  prefillPhone?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ prefillPhone }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const phoneValue = watch('phone');
  const passwordValue = watch('password');

  useEffect(() => {
    if (prefillPhone) {
      setValue('phone', prefillPhone);
    }
  }, [prefillPhone, setValue]);

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: (data) => {
      // The useLogin hook now handles setting the session with supabaseClient.auth.setSession()
      // So, we only need to handle the UI logic here (toast, navigation).
      console.log('Login API response data (from component):', data);

      if (data.success && data.data && data.data.session && data.data.user) {
        // Check if the session was actually set by the hook (optional, depends on error handling in hook)
        // For simplicity, we assume if data.success is true, the hook managed to set the session or log an error.
        toast.success('Iniciaste sesión');
        router.push('/app'); // Navigate after session is likely set
      } else if (data.error) {
        toast.error(data.error.message || 'Credenciales inválidas');
      } else {
        console.error(
          'Login successful but session data is missing or in unexpected format (from component):',
          data
        );
        toast.error('Respuesta inesperada del servidor.');
      }
    },
    onError: (error) => {
      // This will catch errors from the mutationFn (login API call) or if the augmented onSuccess in useLogin re-throws an error.
      console.error('Login mutation error (from component):', error);
      toast.error(error.message || 'Error interno al intentar iniciar sesión.');
    },
  });

  const handleLoginSubmitForm = useCallback(
    (data: LoginFormData) => {
      const sanitizedData = {
        phone: data.phone.trim(),
        password: data.password.trim(),
      };

      loginMutate(sanitizedData);
    },
    [loginMutate]
  );

  return (
    <form onSubmit={handleSubmit(handleLoginSubmitForm)} className="space-y-6">
      <div className="space-y-4">
        {/* Phone Number Input */}
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
              // Bind input to react-hook-form
              {...register('phone')}
              required
            />
            {/* Validation error message for phone (shown if invalid and not empty) */}
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

      {/* Remember Me Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-sm text-slate-500">
          Recordar mi sesión
        </Label>
      </div>

      {/* Submit Button */}
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

      {/* Divider and Social Login Buttons */}
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
