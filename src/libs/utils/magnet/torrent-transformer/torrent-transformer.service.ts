import { Inject, Injectable } from '@nestjs/common';

import * as fs from 'fs';
import { MagnetFile } from '../../../types/magnet/file';
import * as process from 'node:process';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { LogService } from '../../../log/log.service';
import { WebTorrentParseException } from '../../../exceptions/magnet/WebTorrentParseException';

@Injectable()
export class TorrentTransformerService {
  private readonly trackerList = [
    'udp://104.143.10.186:8000/announce',
    'http://tracker.openbittorrent.com:80/announce',
    'http://tracker3.itzmx.com:6961/announce',
    'http://tracker4.itzmx.com:2710/announce',
    'http://tracker.publicbt.com:80/announce',
  ];

  constructor(
    @Inject('package:webtorrent')
    private readonly Webtorrent: typeof import('webtorrent'),
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {}

  parseMagnet(magnet: string) {
    return new Promise((resolve) => {
      const client = new this.Webtorrent();

      try {
        client.add(magnet, { announce: this.trackerList }, (torrent) => {
          const filesList: MagnetFile[] = torrent.files?.map((file) => ({
            name: file.name,
            length: file.length,
          }));

          fs.writeFileSync(
            path.join(
              process.cwd(),
              `${this.configService.get<string>('TORRENT_FILE_PATH')}/${torrent.name}.torrent`,
            ),
            torrent.torrentFile,
          );

          client.destroy();

          resolve({
            filesList,
            name: torrent.name,
            infoHash: torrent.infoHash,
          });
        });
      } catch (error) {
        this.logService.error(
          `❌ Webtorrent 解析文件失败，错误信息为: ${(error as Error).message}`,
        );
        throw new WebTorrentParseException((error as Error).message);
      }
    });
  }
}
