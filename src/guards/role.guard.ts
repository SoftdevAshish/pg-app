import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../helpers/all.enum';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../routes/users/users.service';
import { errorMessage } from '../utils/response';
import { firstLogin, metaKey } from '../../config/config';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const requireRoles = this.reflector.getAllAndOverride<Roles[]>('roles', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride(metaKey, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const isFirstLogin = this.reflector.getAllAndOverride(firstLogin, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    if (!isPublic) {
      const request = ctx.switchToHttp().getRequest();
      const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      const drt = this.jwtService.decode(requestToken);
      const user = await this.userService.findById(drt['sub']);
      const userRole = user.roles;
      // console.log(user.roles, 'User from Role Guard');
      if (!requireRoles) {
        if (!user.isChangePassword && !isFirstLogin) {
          errorMessage(
            'Please change password and keep secret password',
            'ChangePassword',
          );
        }
        return true;
      }
      const superAdmin = userRole === Roles.superAdmin;

      const admin = userRole === Roles.admin || userRole === Roles.users;
      const controlUserRole = requireRoles.some(
        (reqRole) => reqRole === userRole,
      );
      return superAdmin ? true : admin ? true : controlUserRole;
    }
  }
}
