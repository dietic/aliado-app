import { log } from 'console';
import { ApiSuccess, failure, success } from './apiResponse';

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

  // Custom business logic errors
  RESOURCE_EXPIRED: 'RESOURCE_EXPIRED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid input provided',
  [ERROR_CODES.NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.UNAUTHORIZED]: 'Authentication required',
  [ERROR_CODES.FORBIDDEN]: 'Access denied',
  [ERROR_CODES.CONFLICT]: 'Resource already exists',
  [ERROR_CODES.BAD_REQUEST]: 'Invalid request',
  [ERROR_CODES.INTERNAL_ERROR]: 'Internal server error',
  [ERROR_CODES.DATABASE_ERROR]: 'Database operation failed',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'External service unavailable',
  [ERROR_CODES.RESOURCE_EXPIRED]: 'Resource has expired',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
};

export const STATUS_CODES = {
  [ERROR_CODES.VALIDATION_ERROR]: 400,
  [ERROR_CODES.UNAUTHORIZED]: 401,
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

export type ErrorCode = keyof typeof ERROR_CODES;

export const handleApiSuccess = <T>(data: T) => {
  return success(data);
};

export const handleApiError = (error: unknown, customMessage?: string) => {
  if (typeof error === 'string' && error in ERROR_CODES) {
    const errorCode = error as ErrorCode;
    return failure(
      ERROR_CODES[errorCode],
      customMessage || ERROR_MESSAGES[errorCode],
      STATUS_CODES[errorCode]
    );
  }

  if (typeof error === 'string') {
    return failure(ERROR_CODES.BAD_REQUEST, customMessage || error, STATUS_CODES.BAD_REQUEST);
  }

  if (error instanceof Error) {
    return failure(
      ERROR_CODES.INTERNAL_ERROR,
      customMessage || error.message,
      STATUS_CODES.INTERNAL_ERROR
    );
  }

  if (error && typeof error === 'object' && 'code' in error) {
    const errorObj = error as { code: string; message?: string; details?: string };

    switch (errorObj.code) {
      case 'PGRST116': // No rows found
        return failure(
          ERROR_CODES.NOT_FOUND,
          customMessage || 'Resource not found',
          STATUS_CODES.NOT_FOUND
        );
      case '23505': // Unique violation
        return failure(
          ERROR_CODES.CONFLICT,
          customMessage || 'Resource already exists',
          STATUS_CODES.CONFLICT
        );
      case '23503': // Foreign key violation
        return failure(
          ERROR_CODES.BAD_REQUEST,
          customMessage || 'Invalid reference',
          STATUS_CODES.BAD_REQUEST
        );
      case '42501': // Insufficient privilege
        return failure(
          ERROR_CODES.FORBIDDEN,
          customMessage || 'Access denied',
          STATUS_CODES.FORBIDDEN
        );
      default:
        return failure(
          ERROR_CODES.INTERNAL_ERROR,
          customMessage || errorObj.message || ERROR_MESSAGES.INTERNAL_ERROR,
          STATUS_CODES.INTERNAL_ERROR
        );
    }
  }
  return failure(ERROR_CODES.INTERNAL_ERROR, customMessage || 'An unexpected error occurred');
};

export const customErrors = {
  notFoundError: (resource = 'Resource') => {
    return failure(ERROR_CODES.NOT_FOUND, `${resource} not found`, STATUS_CODES.NOT_FOUND);
  },

  validationError: (fields?: string | string[]) => {
    const result = Array.isArray(fields) ? fields.join(', ') : fields;
    return failure(
      ERROR_CODES.VALIDATION_ERROR,
      `Invalid ${result}`,
      STATUS_CODES.VALIDATION_ERROR
    );
  },

  unauthorizedError: () => {
    return failure(ERROR_CODES.UNAUTHORIZED, 'Authentication required', STATUS_CODES.UNAUTHORIZED);
  },

  conflictError: (resource = 'Resource') => {
    return failure(ERROR_CODES.CONFLICT, `${resource} already exists`, STATUS_CODES.CONFLICT);
  },
  rateLimitExceededError: () => {
    return failure(
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      'Rate limit exceeded. Please try again later.',
      STATUS_CODES.RATE_LIMIT_EXCEEDED
    );
  },
};
