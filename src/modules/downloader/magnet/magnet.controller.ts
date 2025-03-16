import { Body, Controller, Post, Res } from '@nestjs/common';
import { MagnetService } from './magnet.service';
import { AddParamDTO } from './dto/magnet.add.dto';
import { Response } from 'express';

// import { MagnetFileDetails } from '../../../libs/types/magnet/file';

@Controller('magnet')
export class MagnetController {
  constructor(private readonly magnetService: MagnetService) {}

  @Post('add')
  async addMagnet(
    @Body() data: AddParamDTO,
    @Res() res: Response,
  ): Promise<void> {
    const results = await this.magnetService.addMagnet(data.magnet);
    res.status(200).json(results);
  }

  // @Post()
  // testFilter(@Body() data: MagnetFileDetails, @Res() res: Response): void {
  //   this.magnetService.filterTest(data);
  // }

  @Post()
  async updateTasksPriority(): Promise<void> {}
}
