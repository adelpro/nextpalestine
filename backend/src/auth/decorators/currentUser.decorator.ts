import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';

import { AuthenticatedUser } from '../types/authenticatedUser.type';

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext): AuthenticatedUser => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    throw new UnauthorizedException('Unauthorized access');
  }

  if (data) {
    return request.user[data];
  }
  const userRequest: AuthenticatedUser = request.user;
  return userRequest;
});
