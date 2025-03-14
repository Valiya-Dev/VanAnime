import { Module } from '@nestjs/common';
import { TorrentTransformerService } from './torrent-transformer/torrent-transformer.service';

@Module({
  providers: [TorrentTransformerService],
  exports: [TorrentTransformerService],
})
export class MagnetModule {}
