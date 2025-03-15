import { Controller, Post } from '@nestjs/common';
import { MagnetService } from './magnet.service';
// import { AddParamDTO } from './dto/magnet.add.dto';
// import { Response } from 'express';
// import { MagnetFileDetails } from '../../../libs/types/magnet/file';

@Controller('magnet')
export class MagnetController {
  constructor(private readonly magnetService: MagnetService) {}

  // @Post()
  // addMagnet(@Body() data: AddParamDTO, @Res() res: Response): void {
  //   const results = this.magnetService.addMagnet(data.magnet);
  //   res.status(200).json(results);
  // }

  // @Post()
  // testFilter(@Body() data: MagnetFileDetails, @Res() res: Response): void {
  //   this.magnetService.filterTest(data);
  // }

  @Post()
  async updateTasksPriority(): Promise<void> {}
}
