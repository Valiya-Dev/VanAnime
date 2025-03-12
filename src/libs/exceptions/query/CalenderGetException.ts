import { BaseException } from '../BaseException';
import { HttpStatusCode } from 'axios';

export class CalenderGetException extends BaseException {
  constructor() {
    super(
      'Get Bangumi calender failed.',
      HttpStatusCode.InternalServerError,
      5000,
    );
  }
}
