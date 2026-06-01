export function captureError(error: Error, context?: Record<string, unknown>): void {
  console.error('Error captured:', error.message, context);
}

export function createErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
