/**
 * Common error interfaces for improved type safety
 */

export interface BaseError {
  message: string;
  code?: string;
  status?: number;
}

export interface SupabaseError extends BaseError {
  details?: string;
  hint?: string;
  statusCode?: number;
}

export interface UploadError extends BaseError {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface AuthError extends BaseError {
  details?: string;
}

export interface NetworkError extends BaseError {
  status: number;
  statusText?: string;
}

export interface ValidationError extends BaseError {
  field?: string;
  value?: unknown;
}

export interface EPUBLoadError extends BaseError {
  type: 'file_not_found' | 'parse_error' | 'permission_denied' | 'network_error' | 'unknown';
  details?: string;
  stack?: string;
}

// Type guard functions
export function isSupabaseError(error: unknown): error is SupabaseError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export function isUploadError(error: unknown): error is UploadError {
  return typeof error === 'object' && error !== null && 'message' in error && 'fileName' in error;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return typeof error === 'object' && error !== null && 'status' in error && typeof (error as NetworkError).status === 'number';
}

export function isAuthError(error: unknown): error is AuthError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

// Error parsing utility
export function parseError(error: unknown): BaseError {
  if (typeof error === 'string') {
    return { message: error };
  }
  
  if (error instanceof Error) {
    return { message: error.message };
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      message: String((error as { message: unknown }).message),
      code: 'code' in error ? String((error as { code: unknown }).code) : undefined,
      status: 'status' in error ? Number((error as { status: unknown }).status) : undefined,
    };
  }
  
  return { message: 'An unknown error occurred' };
}