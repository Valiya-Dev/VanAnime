import { Module } from '@nestjs/common';
import { DmhyService } from './dmhy/dmhy.service';
import { SourcesService } from './sources.service';

@Module({
  providers: [DmhyService, SourcesService],
  exports: [SourcesService],
})
export class SourcesModule {}
