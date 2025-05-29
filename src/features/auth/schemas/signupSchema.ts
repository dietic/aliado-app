import { PHONE_REGEX, PASSWORD_MIN_LENGTH, PASSWORD_SPECIAL_CHARS } from '@/constants/misc';
import z from 'zod';

export const phoneSchema = z.object({
  phone: z.string().min(1, { message: 'Ingresa tu número de teléfono' }).regex(PHONE_REGEX, {
    message: 'Por favor ingresa un número de teléfono válido con código de país',
  }),
});

export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'Ingresa tu nombre' })
    .max(50, { message: 'El nombre no puede exceder 50 caracteres' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
      message: 'El nombre solo puede contener letras y espacios',
    }),
  lastName: z
    .string()
    .min(1, { message: 'Ingresa tus apellidos' })
    .max(50, { message: 'Los apellidos no pueden exceder 50 caracteres' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
      message: 'Los apellidos solo pueden contener letras y espacios',
    }),
  email: z
    .string()
    .min(1, { message: 'Ingresa tu correo electrónico' })
    .email({ message: 'Por favor ingresa un correo electrónico válido' })
    .max(255, { message: 'El correo electrónico es demasiado largo' })
    .toLowerCase(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, {
      message: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
    })
    .max(128, { message: 'La contraseña es demasiado larga' })
    .refine((val) => /[0-9]/.test(val), {
      message: 'La contraseña debe incluir al menos un número',
    })
    .refine((val) => /[a-z]/.test(val), {
      message: 'La contraseña debe incluir al menos una letra minúscula',
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'La contraseña debe incluir al menos una letra mayúscula',
    })
    .refine(
      (val) =>
        new RegExp(`[${PASSWORD_SPECIAL_CHARS.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(
          val
        ),
      {
        message: 'La contraseña debe incluir al menos un carácter especial',
      }
    ),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

// Type definitions
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
