import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryModule } from './modules/query/query.module';
import { SourcesModule } from './libs/sources/sources.module';
import { LogService } from './libs/log/log.service';
import { LogModule } from './libs/log/log.module';

@Module({
  imports: [QueryModule, SourcesModule, LogModule],
  controllers: [AppController],
  providers: [AppService, LogService],
})
export class AppModule {}
