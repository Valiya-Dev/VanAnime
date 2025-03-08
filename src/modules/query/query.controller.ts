import { Body, Controller, Post, Res } from '@nestjs/common';
import { QueryService } from './query.service';
import { Response } from 'express';
import { SearchParamDTO } from './dto/query.search.dto';
import { LogService } from '../../libs/log/log.service';

@Controller('query')
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
    private readonly logger: LogService,
  ) {}

  @Post()
  queryFromSource(@Body() data: SearchParamDTO, @Res() res: Response): void {
    const { source, searchContent } = data;

    const a = 1;
    res.status(200).json({});
  }
}
