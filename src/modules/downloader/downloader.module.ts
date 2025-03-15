import { Module } from '@nestjs/common';
import { MagnetService } from './magnet/magnet.service';
import { MagnetController } from './magnet/magnet.controller';
import { MagnetModule } from '../../libs/utils/magnet/magnet.module';
// import { TorrentTransformerService } from 'src/libs/utils/magnet/torrent-transformer/torrent-transformer.service';

@Module({
  imports: [MagnetModule],
  providers: [MagnetService],
  controllers: [MagnetController],
})
export class DownloaderModule {}
