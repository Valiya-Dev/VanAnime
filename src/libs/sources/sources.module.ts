import { Module } from '@nestjs/common';
import { DmhyService } from './dmhy/dmhy.service';

@Module({
  providers: [DmhyService],
})
export class SourcesModule {}
