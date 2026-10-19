import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { HashidService } from '../services/hashid.service.js';

@Injectable()
export class HashidParamPipe implements PipeTransform<string, number> {
  constructor(private readonly hashidService: HashidService) {}

  transform(value: string): number {
    if (!value || typeof value !== 'string') {
      throw new NotFoundException('Resource not found');
    }

    const trimmed = value.trim();

    // 1. Primary: Decode hashid string (e.g. "m7K9xP2Q")
    const decodedId = this.hashidService.decode(trimmed);
    if (decodedId !== null && decodedId > 0) {
      return decodedId;
    }

    // 2. Dual-Mode Graceful Fallback: Accept pure positive integers during transition
    if (/^\d+$/.test(trimmed)) {
      const parsedNumeric = parseInt(trimmed, 10);
      if (Number.isSafeInteger(parsedNumeric) && parsedNumeric > 0) {
        return parsedNumeric;
      }
    }

    // 3. Invalid identifier -> 404 Not Found (Opaque response, zero information leakage)
    throw new NotFoundException('Resource not found');
  }
}
