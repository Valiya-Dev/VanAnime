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
  async queryFromSource(
    @Body() data: SearchParamDTO,
    @Res() res: Response,
  ): Promise<void> {
    const { source, searchContent } = data;
    const results = await this.queryService.search(source, searchContent);

    res.status(200).json(results);
  }
}
