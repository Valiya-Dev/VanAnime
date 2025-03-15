import { Injectable, LoggerService } from '@nestjs/common';
// import WebTorrent, { Torrent } from 'webtorrent';

// import fs from 'fs';
// import { MagnetFile, MagnetFileDetails } from '../../../types/magnet/file';
// import parseTorrent from 'parse-torrent';

@Injectable()
export class TorrentTransformerService {
  // private client: WebTorrent.Instance;
  private readonly trackerList = [
    'udp://104.143.10.186:8000/announce',
    'http://tracker.openbittorrent.com:80/announce',
    'http://tracker3.itzmx.com:6961/announce',
    'http://tracker4.itzmx.com:2710/announce',
    'http://tracker.publicbt.com:80/announce',
  ];

  constructor(private readonly loggerService: LoggerService) {
    // this.client = new WebTorrent();
  }

  // addMagnet(magnet: string) {
  //   this.client.add(
  //     magnet,
  //     { announce: this.trackerList },
  //     (torrent: Torrent) => {
  //       const filesList: MagnetFile[] = torrent.files?.map((file) => ({
  //         name: file.name,
  //         length: file.length,
  //       }));

  //       fs.writeFileSync(
  //         `/files/torrents/${torrent.name}.torrent`,
  //         torrent.torrentFile,
  //       );

  //       this.client.destroy();

  //       return {
  //         filesList,
  //         name: torrent.name,
  //       };
  //     },
  //   );
  // }

  // filterTorrent(magnetFileDetails: MagnetFileDetails) {
  //   const { torrentName } = magnetFileDetails;
  //   const path = `/files/torrents/${torrentName}.torrent`;
  //   const torrentData = fs.readFileSync(path);
  //   const parsedTorrent = parseTorrent(torrentData);

  //   console.log(parsedTorrent);
  // }
}
