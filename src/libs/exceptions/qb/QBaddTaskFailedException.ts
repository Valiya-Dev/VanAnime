import { BaseException } from '../BaseException';
import { HttpStatusCode } from 'axios';

export class QBaddTaskFailedException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatusCode.InternalServerError, 5000);
  }
}
