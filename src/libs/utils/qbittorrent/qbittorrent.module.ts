import { Global, Module } from '@nestjs/common';
import { QbittorrentService } from './qbittorrent.service';

@Global()
@Module({
  providers: [QbittorrentService],
  exports: [QbittorrentService],
})
export class QbittorrentModule {}
