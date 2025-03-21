import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogService } from '../log/log.service';
import { StoreTaskRecord } from '../../modal/store/StoreTaskRecord';
import { TaskStore } from './TaskStore';
import { FileService } from '../file/file.service';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

@Injectable()
export class StoreService implements OnApplicationBootstrap {
  private readonly storeJsonPath: string;
  private taskStore: TaskStore;

  constructor(
    private readonly logService: LogService,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {
    this.storeJsonPath = this.configService.get<string>('STORE_PATH')
      ? `${this.configService.get<string>('STORE_PATH')}/store.json`
      : '/src/files/store.json';
  }

  addNewRecord(name: string, magnet: string, infoHash: string, source: string) {
    const newTaskRecord: StoreTaskRecord = {
      name,
      magnet,
      infoHash,
      source,
      isCompleted: false,
      addDate: Date.now(),
    };

    this.taskStore.addNewRecord(newTaskRecord);
    fs.writeFile(
      path.join(process.cwd(), this.storeJsonPath),
      JSON.stringify(this.taskStore.getTaskStore(), null, 2),
      { encoding: 'utf8' },
      (error) => {
        if (error) {
          this.logService.error('[ERROR] 更新store.json失败', error.stack);
          throw error as Error;
        }

        this.logService.log('[OK] 已更新store.json');
      },
    );
  }

  getTaskStore() {
    return this.taskStore;
  }

  onApplicationBootstrap(): any {
    try {
      const store = this.fileService.getStoreJson(
        this.storeJsonPath,
      ) as StoreTaskRecord[];
      this.taskStore = new TaskStore(store);
    } catch (error) {
      this.logService.error(
        `[ERROR] 解析本地store文件失败，请检查store.json对应路径`,
      );
      throw error as Error;
    }
  }
}
