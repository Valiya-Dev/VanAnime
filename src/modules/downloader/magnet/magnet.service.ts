import { Injectable } from '@nestjs/common';
import { QbittorrentService } from '../../../libs/utils/qbittorrent/qbittorrent.service';

@Injectable()
export class MagnetService {
  constructor(private readonly qbService: QbittorrentService) {}

  async addMagnet(magnet: string) {}
}
