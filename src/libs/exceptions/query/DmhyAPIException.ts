import { BaseException } from '../BaseException';
import { HttpStatusCode } from 'axios';

export class DmhyAPIException extends BaseException {
  constructor() {
    super(
      'AnimeGarden API overtime or fetch failed.',
      HttpStatusCode.ServiceUnavailable,
      5003,
    );
  }
}
