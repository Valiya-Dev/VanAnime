import { Injectable } from '@nestjs/common';
import { QbittorrentService } from '../../../libs/utils/qbittorrent/qbittorrent.service';
import { TorrentTransformerService } from '../../../libs/utils/magnet/torrent-transformer/torrent-transformer.service';

// import { MagnetFileDetails } from '../../../libs/types/magnet/file';

@Injectable()
export class MagnetService {
  constructor(
    private readonly qbService: QbittorrentService,
    private readonly torrentTransformService: TorrentTransformerService,
  ) {}

  async addMagnet(magnet: string) {
    const res = await this.torrentTransformService.addMagnet(magnet);
    console.log(res);
    return res;
  }

  // filterTest(magnetFileDetails: MagnetFileDetails) {
  //   this.torrentTransformService.filterTorrent(magnetFileDetails);
  // }
}
