export class AppError extends Error {
  code: string;

  details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.details
      ? `${error.message} ${error.details}`
      : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}
