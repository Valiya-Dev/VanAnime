import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(message: string, statusCode: number, errorCode?: number) {
    super(
      {
        success: false,
        message,
        errorCode: errorCode || statusCode,
      },
      statusCode,
    );
  }
}
