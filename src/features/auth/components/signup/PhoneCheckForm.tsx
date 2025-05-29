import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { Phone, Loader, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PhoneFormData, phoneSchema } from '../../schemas/signupSchema';
import React, { useCallback, useState } from 'react';
import { RegistrationStep } from '@/constants/misc';
import { useGetUserByPhone } from '@/features/users/hooks/useGetUserByPhone';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const PhoneCheckForm: React.FC<{
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
  setPhoneValue: (name: string, value: string) => void;
}> = React.memo(({ setRegistrationStep, setPhoneValue }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    mode: 'onChange',
  });

  const { mutate: checkPhone, isPending: checkingPhone } = useGetUserByPhone({
    onSuccess: (data) => {
      if (data) {
        if (data && data.success) {
          router.replace('/app/auth?mode=login');
          return toast.success(data?.data?.id ? 'Cuenta encontrada, redirigiendo...' : 'Error');
        }
        if (data.error) {
          if (data.error.code !== 'NOT_FOUND') {
            return toast.error(data.error?.message);
          }
          setPhoneValue('phone', phoneValue);
          setRegistrationStep(RegistrationStep.SIGN_UP);
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Error checking phone number');
    },
  });
  const handlePhoneCheckSubmit = () => {
    checkPhone({ phone: phoneValue });
  };

  const phoneValue = watch('phone');

  return (
    <div className="transition-all duration-300 opacity-100 translate-x-0">
      <form onSubmit={handleSubmit(handlePhoneCheckSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="check-phone" className="dark:text-slate-200">
            Número de teléfono
          </Label>
          <div className="relative">
            <Phone
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 ${
                phoneValue && errors.phone ? '-translate-y-[110%]' : ''
              }`}
            />
            <Input
              id="check-phone"
              type="tel"
              placeholder="912345678"
              className={`pl-10 ${
                phoneValue && errors.phone ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              {...register('phone')}
              autoComplete="tel"
              aria-describedby={errors.phone ? 'phone-error' : 'phone-help'}
            />
            {phoneValue && errors.phone && (
              <div id="phone-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.phone.message}
              </div>
            )}
          </div>
          <p id="phone-help" className="text-xs text-slate-500 mt-1">
            Ingresa tu número con código de país para verificar si ya tienes una cuenta
          </p>
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={checkingPhone || !isValid}
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
  );
});
