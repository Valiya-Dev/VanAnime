import { Controller, Post } from '@nestjs/common';
import { MagnetService } from './magnet.service';

@Controller('magnet')
export class MagnetController {
  constructor(private readonly magnetService: MagnetService) {}

  @Post()
  async addManget(): Promise<void> {}

  @Post()
  async updateTasksPriority(): Promise<void> {}
}
