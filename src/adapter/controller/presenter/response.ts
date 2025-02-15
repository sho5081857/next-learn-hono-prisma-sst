export interface Error {
  message: string;
  code: number;
}

export interface ErrorResponse {
  error: Error;
}

export function newErrorResponse(
  code: number,
  message: string
): { status: number; body: ErrorResponse } {
  return {
    status: code,
    body: {
      error: {
        message,
        code,
      },
    },
  };
}
