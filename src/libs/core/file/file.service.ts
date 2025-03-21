import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { LogService } from '../log/log.service';
import * as process from 'node:process';

@Injectable()
export class FileService implements OnApplicationBootstrap {
  private readonly torrentFilePath: string;
  private readonly storeJsonPath: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {
    this.torrentFilePath =
      this.configService.get<string>('TORRENT_FILE_PATH') ||
      '/src/files/torrents';
    this.storeJsonPath = this.configService.get<string>('STORE_PATH')
      ? `${this.configService.get<string>('STORE_PATH')}/store.json`
      : '/src/files/store.json';
  }

  onApplicationBootstrap() {
    this.folderInit(this.torrentFilePath);
    this.fileInit(this.storeJsonPath);
  }

  private folderInit(folderPath: string) {
    if (!fs.existsSync(path.join(process.cwd(), folderPath))) {
      fs.mkdirSync(path.join(process.cwd(), folderPath), {
        recursive: true,
      });
      this.logService.log(`[OK] 目录已创建: ${folderPath}`);
    } else {
      this.logService.log(`[INFO] 目录已存在: ${folderPath}`);
    }
  }

  private fileInit(filePath: string) {
    if (!fs.existsSync(path.join(process.cwd(), filePath))) {
      fs.writeFileSync(
        path.join(process.cwd(), filePath),
        JSON.stringify([], null, 2),
        'utf8',
      );

      this.logService.log(`[OK] 文件已创建: ${filePath}`);
    } else {
      this.logService.log(`[INFO] 文件已存在: ${filePath}`);
    }
  }

  getStoreJson(storePath: string) {
    const rawData = fs.readFileSync(
      path.join(process.cwd(), storePath),
      'utf8',
    );

    return JSON.parse(rawData);
  }
}
