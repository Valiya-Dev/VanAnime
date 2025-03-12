import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogService } from '../../log/log.service';
import axios, { AxiosInstance } from 'axios';
import { QBLoginFailedException } from '../../exceptions/qb/QBLoginFailedException';
import { QBaddTaskFailedException } from '../../exceptions/qb/QBaddTaskFailedException';
import { QBtaskInfoException } from '../../exceptions/qb/QBtaskInfoException';

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
}
