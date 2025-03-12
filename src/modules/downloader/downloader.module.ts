import { Module } from '@nestjs/common';
import { MagnetService } from './magnet/magnet.service';
import { MagnetController } from './magnet/magnet.controller';

@Module({
  providers: [MagnetService],
  controllers: [MagnetController],
})
export class DownloaderModule {}
