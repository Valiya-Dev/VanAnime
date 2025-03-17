import { Injectable } from '@nestjs/common';
import { QbittorrentService } from '../../../libs/utils/qbittorrent/qbittorrent.service';
import { TorrentTransformerService } from '../../../libs/utils/magnet/torrent-transformer/torrent-transformer.service';
import { MagnetFileDetails } from '../../../libs/types/magnet/file';
import { MagnetParseResponseDto } from './dto/magnet.response.dto';
import { HttpStatusCode } from 'axios';
import { ResponseBase } from '../../../libs/dto/response-base.dto';

@Injectable()
export class MagnetService {
  constructor(
    private readonly qbService: QbittorrentService,
    private readonly torrentTransformService: TorrentTransformerService,
  ) {}

  async parseMagnet(magnet: string) {
    const results = await this.torrentTransformService.parseMagnet(magnet);
    const response = new MagnetParseResponseDto(
      HttpStatusCode.Ok,
      true,
      results as MagnetFileDetails,
    );
    return response;
  }

  async submitNewTask(filedetails: MagnetFileDetails) {
    const result = await this.qbService.submitNewTask(filedetails);
    const response = new ResponseBase(
      result ? HttpStatusCode.Ok : HttpStatusCode.BadRequest,
      result,
    );
    return response;
  }
}
