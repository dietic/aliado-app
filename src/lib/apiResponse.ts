import { NextResponse } from 'next/server';

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export function success<T>(data: T, message: string = 'Success', statusCode: number = 200) {
  return NextResponse.json({ success: true, data, message }, { status: statusCode });
}

export function failure(code: string, message: string, statusCode: number = 500) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
    },
    { status: statusCode }
  );
}
