import { Module } from '@nestjs/common';
import { TorrentTransformerService } from './torrent-transformer/torrent-transformer.service';

export const importPackage = (packageName: string) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-implied-eval,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
  new Function(`return import('${packageName}')`)().then(
    (loadedModule: { [x: string]: any }) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      loadedModule['default'] ?? loadedModule,
  );

@Module({
  providers: [
    {
      provide: 'package:webtorrent',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      useFactory: () => importPackage('webtorrent'),
    },
    TorrentTransformerService,
  ],
  exports: [TorrentTransformerService],
})
export class MagnetModule {}
