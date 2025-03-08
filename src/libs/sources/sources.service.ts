import { Injectable } from '@nestjs/common';
import { DmhyService } from './dmhy/dmhy.service';
import { SourceServiceInterface } from '../interfaces/source-service.interface';

@Injectable()
export class SourcesService {
  private readonly sources: Record<string, SourceServiceInterface<any>>;

  constructor(private readonly dmhyService: DmhyService) {
    this.sources = {
      dmhy: this.dmhyService,
    };
  }

  getService(source: string) {
    return this.sources[source] || null;
  }

  getServiceList() {
    return this.sources;
  }
}
