import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type {
  AuthRequest,
  AuthUser,
} from '../interfaces/auth-request.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
