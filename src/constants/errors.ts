export const ERROR_CODES = {
  // Client errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST: 'BAD_REQUEST',

  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Custom business logic errors
  RESOURCE_EXPIRED: 'RESOURCE_EXPIRED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.VALIDATION_ERROR]: 'Por favor, revisa los datos ingresados.',
  [ERROR_CODES.NOT_FOUND]: 'No pudimos encontrar lo que buscas.',
  [ERROR_CODES.UNAUTHORIZED]: 'Necesitas iniciar sesión para continuar.',
  [ERROR_CODES.FORBIDDEN]: 'No tienes permiso para realizar esta acción.',
  [ERROR_CODES.CONFLICT]: 'El recurso ya existe',
  [ERROR_CODES.BAD_REQUEST]: 'Hubo un problema con tu solicitud.',
  [ERROR_CODES.INTERNAL_ERROR]: 'Algo salió mal. Intenta de nuevo más tarde.',
  [ERROR_CODES.DATABASE_ERROR]: 'No pudimos guardar tus datos. Intenta más tarde.',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'El servicio no está disponible en este momento.',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Credenciales inválidas',
  [ERROR_CODES.RESOURCE_EXPIRED]: 'Este recurso ya no está disponible.',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Has realizado demasiadas solicitudes. Intenta más tarde.',
};

export const STATUS_CODES = {
  [ERROR_CODES.VALIDATION_ERROR]: 400,
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.INVALID_CREDENTIALS]: 401,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.CONFLICT]: 409,
  [ERROR_CODES.BAD_REQUEST]: 400,
  [ERROR_CODES.INTERNAL_ERROR]: 500,
  [ERROR_CODES.DATABASE_ERROR]: 500,
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 502,
  [ERROR_CODES.RESOURCE_EXPIRED]: 410,
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 429,
};

// TODO: this has to be checked because I can't find documentation for these codes
export const SUPABASE_ERROR_CODES = {
  PGRST116: 'NOT_FOUND', // Resource not found
  PGRST101: 'BAD_REQUEST', // Bad request
  PGRST102: 'UNAUTHORIZED', // Unauthorized
  PGRST103: 'FORBIDDEN', // Forbidden
  PGRST104: 'CONFLICT', // Conflict
  PGRST105: 'INTERNAL_ERROR', // Internal server error
};

export type ErrorCode = keyof typeof ERROR_CODES;
