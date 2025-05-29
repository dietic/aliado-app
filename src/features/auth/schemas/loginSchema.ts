import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .length(9, { message: 'Ingresa un número de teléfono correcto' })
    .regex(/^\+?[0-9\s]{8,15}$/, {
      message: 'Por favor ingresa un número de teléfono válido con código de país',
    }),
  password: z.string().min(1, { message: 'Ingresa tu contraseña' }),
});
export type LoginFormData = z.infer<typeof loginSchema>;
