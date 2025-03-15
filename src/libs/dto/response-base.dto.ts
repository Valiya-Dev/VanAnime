import { ApiProperty } from '@nestjs/swagger';

export class ResponseBase {
  constructor(statusCode: number, success: boolean) {
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
