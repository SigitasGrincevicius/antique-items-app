import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest } from '../auth.request';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.user.sub;
  },
);
