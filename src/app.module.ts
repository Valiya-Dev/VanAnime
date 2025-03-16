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
import { MagnetModule } from './libs/utils/magnet/magnet.module';
import { FileModule } from './libs/utils/file/file.module';

@Module({
  imports: [
    QueryModule,
    SourcesModule,
    LogModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalCacheModule,
    DownloaderModule,
    QbittorrentModule,
    MagnetModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService, LogService],
  exports: [GlobalCacheModule, QbittorrentModule],
})
export class AppModule {
  // async onModuleInit() {
  //   // https://github.com/nestjs/docs.nestjs.com/issues/3093 如何动态import
  //   const { default: WebTorrent } = await import('webtorrent');
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const client = new WebTorrent();
  // }
}
