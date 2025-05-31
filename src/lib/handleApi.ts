import { ERROR_CODES, ERROR_MESSAGES, ErrorCode, STATUS_CODES } from '@/constants/errors';
import { failure, success } from './apiResponse';

export const handleApiSuccess = <T>(data: T, message?: string) => {
  return success(data, message);
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
          customMessage || ERROR_MESSAGES.NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      case '23505': // Unique violation
        return failure(
          ERROR_CODES.CONFLICT,
          customMessage || ERROR_MESSAGES.CONFLICT,
          STATUS_CODES.CONFLICT
        );
      case '23503': // Foreign key violation
        return failure(
          ERROR_CODES.BAD_REQUEST,
          customMessage || ERROR_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      case '42501': // Insufficient privilege
        return failure(
          ERROR_CODES.FORBIDDEN,
          customMessage || ERROR_MESSAGES.FORBIDDEN,
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
  notFoundError: (resource = 'Recurso') => {
    return failure(ERROR_CODES.NOT_FOUND, `${resource} no encontrado`, STATUS_CODES.NOT_FOUND);
  },

  validationError: (fields?: string | string[]) => {
    const result = Array.isArray(fields) ? fields.join(', ') : fields;
    return failure(
      ERROR_CODES.VALIDATION_ERROR,
      `${result} inválido(s)`,
      STATUS_CODES.VALIDATION_ERROR
    );
  },

  unauthorizedError: () => {
    return failure(
      ERROR_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED,
      STATUS_CODES.UNAUTHORIZED
    );
  },

  conflictError: (resource = 'Resource') => {
    return failure(ERROR_CODES.CONFLICT, `${resource} ya existe`, STATUS_CODES.CONFLICT);
  },
  rateLimitExceededError: () => {
    return failure(
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      STATUS_CODES.RATE_LIMIT_EXCEEDED
    );
  },
};
