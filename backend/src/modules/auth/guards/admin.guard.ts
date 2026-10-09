import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/** @deprecated All authenticated accounts are admins in the admin-only schema. */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean { return true; }
}
