import { LoginFormData } from '../../features/auth/schemas/loginSchema';

export type LoginParams = LoginFormData;

export interface SignUpParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  // Add any other fields your signUp mutation might take
}
