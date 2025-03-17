import { BaseException } from '../BaseException';
import { HttpStatusCode } from 'axios';

export class WebTorrentParseException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatusCode.InternalServerError, 5000);
  }
}
