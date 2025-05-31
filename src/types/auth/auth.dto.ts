import { Session, User } from '@supabase/supabase-js';

export interface AuthUserDTO {
  id: string;
  email: string;
  phone?: string;
  created_at: string;
  last_sign_in_at?: string;
  role?: string;
}

export interface LoginApiResponse {
  success: boolean;
  data?: {
    session: Session;
    user: User;
  };
  error?: {
    message: string;
  };
}

export type LoginSuccessResponse = {
  success: true;
  data: {
    session: Session;
    user: User;
  };
  error?: never;
};
