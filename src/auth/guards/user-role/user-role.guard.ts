import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // get required roles by handler
    const validRoles: string[] = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );

    // get user from request
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user: User = request.user;

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    // if no roles are required, allow access
    if (!validRoles || validRoles.length === 0) {
      return true;
    }

    // check if user has any of the required roles
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    return false;
  }
}
