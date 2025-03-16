import { Inject, Injectable } from '@nestjs/common';

import * as fs from 'fs';
import { MagnetFile, MagnetFileDetails } from '../../../types/magnet/file';
import * as process from 'node:process';
import * as path from 'path';

// import parseTorrent from 'parse-torrent';

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
  ) {}

  addMagnet(magnet: string) {
    return new Promise((resolve, reject) => {
      const client = new this.Webtorrent();
      client.add(magnet, { announce: this.trackerList }, (torrent) => {
        const filesList: MagnetFile[] = torrent.files?.map((file) => ({
          name: file.name,
          length: file.length,
        }));

        fs.writeFileSync(
          path.join(
            process.cwd(),
            `/src/files/torrents/${torrent.name}.torrent`,
          ),
          torrent.torrentFile,
        );

        client.destroy();

        resolve({
          filesList,
          name: torrent.name,
        });
      });
    });
  }

  // filterTorrent(magnetFileDetails: MagnetFileDetails) {
  //   const { torrentName } = magnetFileDetails;
  //   const path = `/files/torrents/${torrentName}.torrent`;
  //   const torrentData = fs.readFileSync(path);
  //   const parsedTorrent = parseTorrent(torrentData);

  //   console.log(parsedTorrent);
  // }
}
