import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/roles.type';

export const Roles = (roles: Role[] | Role) => SetMetadata('roles', roles);
