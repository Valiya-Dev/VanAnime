import { ApiProperty } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

export class ResponseBase {
  constructor(statusCode: HttpStatusCode, success: boolean) {
    this.statusCode = statusCode;
    this.success = success;
  }

  @ApiProperty({ description: 'Response status code' })
  readonly statusCode: number;

  @ApiProperty({ description: 'Response status' })
  readonly success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;
}
