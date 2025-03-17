import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogService } from '../../log/log.service';
import axios, { AxiosInstance } from 'axios';
import { QBLoginFailedException } from '../../exceptions/qb/QBLoginFailedException';
import { QBaddTaskFailedException } from '../../exceptions/qb/QBaddTaskFailedException';
import { QBtaskInfoException } from '../../exceptions/qb/QBtaskInfoException';
import {
  MagnetFile,
  MagnetFileDetails,
  QBTaskContent,
} from '../../types/magnet/file';
import * as path from 'path';
import * as fs from 'fs';
import FormData from 'form-data';
import * as process from 'node:process';
import { QBresumeTaskException } from '../../exceptions/qb/QBresumeTaskException';

@Injectable()
export class QbittorrentService implements OnModuleInit {
  private qbHost: string | undefined = undefined;
  private username: string | undefined = undefined;
  private password: string | undefined = undefined;
  private axiosInstance: AxiosInstance;
  private cookie: string | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {
    this.qbHost = this.configService.get<string>('QB_HOST');
    this.username = this.configService.get<string>('QB_USERNAME');
    this.password = this.configService.get<string>('QB_PASSWORD');
    this.axiosInstance = axios.create({
      baseURL: this.qbHost,
      withCredentials: true,
    });
  }

  async onModuleInit() {
    await this.QBlogin();
  }

  async QBlogin() {
    try {
      const response = await this.axiosInstance.post(
        '/api/v2/auth/login',
        {
          username: this.username,
          password: this.password,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Referer: this.qbHost,
            Origin: this.qbHost,
          },
        },
      );

      if (response.headers['set-cookie']) {
        this.cookie = response.headers['set-cookie'][0];
        this.logService.log('✅ qBittorrent 登录成功');
      } else {
        this.logService.error('❌ qBittorrent 登录失败，未返回 Cookie');
      }
    } catch (error) {
      this.logService.error('❌ qBittorrent 连接失败, 请检查QB配置重启重试');
      throw new QBLoginFailedException((error as Error).message);
    }
  }

  async addMagnet(magnet: string) {
    try {
      const response = await this.axiosInstance.post(
        '/api/v2/torrents/add',
        { urls: magnet },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Cookie: this.cookie,
          },
        },
      );

      if (response.status === 200) {
        this.logService.log('✅ 已提交磁力链接');
      } else {
        this.logService.error('❌ 磁力链接提交失败，格式可能有误');
        throw new QBaddTaskFailedException(
          'QB提交API没有返回200, 磁力链接格式可能不正确',
        );
      }
    } catch (error) {
      this.logService.error('❌ QB提交API出错，提交失败');
      throw new QBaddTaskFailedException((error as Error).message);
    }
  }

  async submitNewTask(fileDetails: MagnetFileDetails) {
    const { filesList, torrentName, infoHash } = fileDetails;
    const addResult = await this.addTorrent(torrentName).then();
    await this.dealy(3000);

    if (addResult) {
      const torrentContents = await this.getTorrentContents(infoHash);

      if (torrentContents) {
        const changePrioResult = await this.changeContentPrio(
          infoHash,
          filesList,
          torrentContents,
        );

        if (changePrioResult) {
          const resumeResult = await this.resumeQBTask(infoHash);

          if (resumeResult) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // metaDL, stoppedDL, downloading,

  private async getTaskState(hash: string) {
    try {
      const response = await this.axiosInstance.get('/api/v2/torrents/info', {
        params: {
          hashes: hash,
        },
        headers: { Cookie: this.cookie },
      });

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      this.logService.error('❌ 获取QB任务失败');
      throw new QBtaskInfoException((error as Error).message);
    }
  }

  private async addTorrent(torrentName: string) {
    const torrentPath = path.join(
      process.cwd(),
      `${this.configService.get<string>('TORRENT_FILE_PATH')}/${torrentName}.torrent`,
    );
    const form = new FormData();

    form.append('torrents', fs.createReadStream(torrentPath));
    form.append('stopped', 'true');

    try {
      const response = await this.axiosInstance.post(
        '/api/v2/torrents/add',
        form,
        {
          headers: {
            ...form.getHeaders(),
            Cookie: this.cookie,
          },
        },
      );

      if (response.status === 200) {
        return true;
      } else {
        this.logService.error('❌ QB提交API出错，提交失败');
        return false;
      }
    } catch (error) {
      this.logService.error('❌ QB提交API出错，提交失败');
      throw new QBaddTaskFailedException((error as Error).message);
    }
  }

  private async getTorrentContents(hash: string) {
    try {
      const response = await this.axiosInstance.get('/api/v2/torrents/files', {
        params: {
          hash,
        },
        headers: {
          Cookie: this.cookie,
        },
      });

      if (response.status === 200) {
        return response.data as QBTaskContent[];
      }
    } catch (error) {
      this.logService.error('❌ QB获取文件列表API出错，获取失败');
      throw new QBaddTaskFailedException((error as Error).message);
    }
  }

  private async changeContentPrio(
    hash: string,
    filesList: MagnetFile[],
    torrentContents: QBTaskContent[],
  ) {
    const selectedFiles = new Set(filesList.map((file) => file.name));
    const unselected = torrentContents.filter(
      (content: { name: string }) =>
        !selectedFiles.has(content.name.split('/')[1]),
    );

    let id = '';

    for (const file of unselected) {
      if (id === '') id += file.index;
      else id = id + '|' + file.index;
    }

    try {
      const response = await this.axiosInstance.post(
        `/api/v2/torrents/filePrio`,
        {
          hash,
          id,
          priority: 0,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Cookie: this.cookie,
          },
        },
      );

      if (response.status === 200) {
        return true;
      } else {
        this.logService.error(
          `❌ QB修改文件优先级失败，错误: ${response.status}`,
        );
        return false;
      }
    } catch (error) {
      this.logService.error('❌ QB修改文件优先级API出错，提交失败');
      throw new QBaddTaskFailedException((error as Error).message);
    }
  }

  private async resumeQBTask(hash: string) {
    try {
      const response = await this.axiosInstance.post(
        '/api/v2/torrents/start',
        { hashes: hash },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Cookie: this.cookie,
          },
        },
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      this.logService.error(
        `❌ QB恢复任务下载失败，错误信息: ${(error as Error).message}`,
      );
      throw new QBresumeTaskException((error as Error).message);
    }
  }

  private dealy(ms: number) {
    return new Promise((resolve) => {
      this.logService.log('等待QB生成任务.......');
      setTimeout(resolve, ms);
    });
  }
}
