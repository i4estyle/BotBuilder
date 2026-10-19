import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HashidService } from '../services/hashid.service.js';

@Injectable()
export class HashidInterceptor implements NestInterceptor {
  constructor(private readonly hashidService: HashidService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data: unknown) => this.transform(data)));
  }

  private transform(data: unknown): unknown {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformSection(item));
    }

    return this.transformSection(data);
  }

  private transformSection(item: unknown): unknown {
    if (!item || typeof item !== 'object') {
      return item;
    }

    const record = item as Record<string, unknown>;

    // Detect PageSection entities by characteristic properties
    const isPageSectionEntity =
      typeof record.id === 'number' &&
      Number.isInteger(record.id) &&
      ('sectionKey' in record || 'pageName' in record);

    if (isPageSectionEntity) {
      return {
        ...record,
        id: this.hashidService.encode(record.id as number),
      };
    }

    return item;
  }
}
