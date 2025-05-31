import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .trim() // Trim whitespace first
    .length(9, { message: 'El número de teléfono debe tener 9 dígitos.' })
    .regex(/^[0-9]{9}$/, {
      // Ensure it's exactly 9 digits
      message: 'El número de teléfono debe contener solo 9 dígitos.',
    }),
  password: z
    .string()
    .trim() // Also trim password
    .min(1, { message: 'Ingresa tu contraseña' }),
});
export type LoginFormData = z.infer<typeof loginSchema>;
