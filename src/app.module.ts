import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryModule } from './modules/query/query.module';
import { SourcesModule } from './libs/sources/sources.module';
import { LogService } from './libs/log/log.service';
import { LogModule } from './libs/log/log.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalCacheModule } from './libs/cache/cache.module';
import { DownloaderModule } from './modules/downloader/downloader.module';
import { QbittorrentModule } from './libs/utils/qbittorrent/qbittorrent.module';

@Module({
  imports: [
    QueryModule,
    SourcesModule,
    LogModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalCacheModule,
    DownloaderModule,
    QbittorrentModule,
  ],
  controllers: [AppController],
  providers: [AppService, LogService],
  exports: [GlobalCacheModule, QbittorrentModule],
})
export class AppModule {}
