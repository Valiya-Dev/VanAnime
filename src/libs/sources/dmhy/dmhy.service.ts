import { Injectable } from '@nestjs/common';
import { SourceServiceInterface } from '../../interfaces/source-service.interface';
import { DMHYSearchContent } from '../../types/query/query.body';
import { SearchResult } from '../../types/query/query.search-result';
import { fetchResources } from 'animegarden';
import { LogService } from '../../log/log.service';

@Injectable()
export class DmhyService implements SourceServiceInterface<DMHYSearchContent> {
  constructor(private readonly logService: LogService) {}

  async search(query: DMHYSearchContent): Promise<SearchResult[]> {
    const fetchQuery = {
      ...query,
      provider: 'dmhy',
      page: 1,
      pageSize: 20,
    };

    this.logService.log(fetchQuery);

    try {
      const response = await fetchResources(fetch, fetchQuery);
      const resources = response.resources;
      return resources.map((resource) => {
        return {
          provider: resource.provider,
          title: resource.title,
          href: resource.href,
          type: resource.type,
          magnet: resource.magnet,
          size: resource.size,
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
