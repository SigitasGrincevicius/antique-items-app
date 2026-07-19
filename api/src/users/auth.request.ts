import type { Request } from 'express';
import type { Role } from './role.enum';

export interface AuthUser {
  sub: string;
  name: string;
  roles: Role[];
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
