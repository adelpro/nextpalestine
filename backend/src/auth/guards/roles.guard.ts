import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Role } from '../types/roles.type';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}
  roleMatsh(roles: Role[] | Role, userRole: Role) {
    if (Array.isArray(roles)) {
      return roles.some((role) => role === userRole);
    } else {
      return roles === userRole;
    }
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const foundUser = await this.userService.getUserById(user.id);
    if (!foundUser) {
      return false;
    }
    return this.roleMatsh(roles, foundUser?.role || 'user');
  }
}
