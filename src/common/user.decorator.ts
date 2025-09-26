import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, RequestWithUser } from './types';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
