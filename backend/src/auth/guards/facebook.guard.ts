import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
  constructor(private authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const token = await this.authService.generateAndSaveToken(user, request.headers['x-fingerprint'] || '');

    request.refreshToken = token;

    return true;
  }
}
