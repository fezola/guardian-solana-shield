
import { toast } from "@/components/ui/use-toast";

export enum ErrorType {
  NETWORK = "network",
  AUTH = "auth",
  VALIDATION = "validation",
  SERVER = "server",
  UNKNOWN = "unknown"
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  originalError?: unknown;
}

export const createAppError = (type: ErrorType, message: string, code?: string, originalError?: unknown): AppError => {
  return { type, message, code, originalError };
};

export const handleAppError = (error: AppError) => {
  // Log the error
  console.error(`${error.type.toUpperCase()} ERROR:`, error);

  // Show user-friendly toast notification
  toast({
    title: getErrorTitle(error.type),
    description: error.message,
    variant: "destructive",
  });

  // Return the error to be handled by the caller if needed
  return error;
};

export const captureApiError = async (promise: Promise<any>): Promise<[any, AppError | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error: any) {
    let appError: AppError;

    if (error?.response) {
      // Handle API errors with response
      appError = createAppError(
        getErrorTypeFromStatus(error.response.status),
        error.response.data?.message || "An error occurred with the API request",
        error.response.status.toString(),
        error
      );
    } else if (error?.request) {
      // Handle network errors
      appError = createAppError(
        ErrorType.NETWORK,
        "Unable to connect to the server. Please check your internet connection.",
        "NETWORK_ERROR",
        error
      );
    } else {
      // Handle all other errors
      appError = createAppError(
        ErrorType.UNKNOWN,
        error.message || "An unexpected error occurred",
        "UNKNOWN_ERROR",
        error
      );
    }

    handleAppError(appError);
    return [null, appError];
  }
};

const getErrorTypeFromStatus = (status: number): ErrorType => {
  if (status === 401 || status === 403) return ErrorType.AUTH;
  if (status === 400 || status === 422) return ErrorType.VALIDATION;
  if (status >= 500) return ErrorType.SERVER;
  return ErrorType.UNKNOWN;
};

const getErrorTitle = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.NETWORK:
      return "Connection Error";
    case ErrorType.AUTH:
      return "Authentication Error";
    case ErrorType.VALIDATION:
      return "Validation Error";
    case ErrorType.SERVER:
      return "Server Error";
    default:
      return "Error";
  }
};
