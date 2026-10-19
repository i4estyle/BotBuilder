import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Hashids from 'hashids';

@Injectable()
export class HashidService {
  private readonly hashids: Hashids;

  constructor(private readonly configService: ConfigService) {
    const salt =
      this.configService.get<string>('HASHID_SALT') ??
      'botbuilder-secure-hashid-salt-enterprise-2026';
    const minLength = 8;
    // 54-character safe alphabet omitting ambiguous characters (0, O, 1, l, I)
    const alphabet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    this.hashids = new Hashids(salt, minLength, alphabet);
  }

  encode(id: number): string {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Invalid ID for hashid encoding: ${id}`);
    }
    return this.hashids.encode(id);
  }

  decode(hash: string): number | null {
    if (!hash || typeof hash !== 'string') {
      return null;
    }
    try {
      const decoded = this.hashids.decode(hash);
      if (!decoded || decoded.length === 0) {
        return null;
      }
      const id = Number(decoded[0]);
      return Number.isSafeInteger(id) && id > 0 ? id : null;
    } catch {
      return null;
    }
  }
}
