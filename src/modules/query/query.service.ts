import { Injectable } from '@nestjs/common';
import { SourcesService } from '../../libs/sources/sources.service';
import { DMHYSearchContent } from '../../libs/types/query/query.body';
import { SearchResult } from '../../libs/types/query/query.search-result';

@Injectable()
export class QueryService {
  constructor(private readonly sourcesService: SourcesService) {}

  async search(
    source: string,
    searchContent: DMHYSearchContent,
  ): Promise<SearchResult[]> {
    const searchService = this.sourcesService.getService(source);

    try {
      const res = await searchService?.search(searchContent);
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }
}
