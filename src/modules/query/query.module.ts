import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';
import { SourcesModule } from '../../libs/sources/sources.module';

@Module({
  imports: [SourcesModule],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
