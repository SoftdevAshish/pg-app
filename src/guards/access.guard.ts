import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { access_strategy, metaKey } from '../../config/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../routes/users/users.service';
import { ExtractJwt } from 'passport-jwt';
import { errorMessage, unauthorizedErrorMessage } from '../utils/response';

@Injectable()
export class AccessGuard extends AuthGuard(access_strategy) {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    let isMatchToken = false;
    const isPublic = this.reflector.getAllAndOverride(metaKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      isMatchToken = true;
      return true;
    }
    if (!isPublic) {
      const request = context.switchToHttp().getRequest();
      const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      console.log(requestToken);
      console.log(request.headers);
      if (!requestToken) {
        unauthorizedErrorMessage(
          `Sorry to access. You don't have access token. please check and verify your credential and contact admin.`,
          'Unauthorized',
        );
      }
      const isPassToken = await this.compareToken(requestToken);
      isMatchToken = isPassToken;
      if (!isPassToken) {
        errorMessage('Your Token Expired.  try again', 'token expire');
      }
    }

    const preCanActivate = (await super.canActivate(context)) as boolean;
    return preCanActivate && isMatchToken;
  }

  //Request access token compare to database Access Token
  async compareToken(requestToken: string) {
    const reqToken = this.jwtService.decode(requestToken);
    const checkUser = await this.userService.findById(reqToken['sub']);
    if (
      !checkUser.accessToken ||
      !checkUser.refreshToken ||
      checkUser.accessToken === '' ||
      checkUser.refreshToken === '' ||
      checkUser.accessToken === null ||
      checkUser.refreshToken === null
    ) {
      errorMessage('Please Login first and try again.', 'token');
    }
    const reqTokenFromDatabase = this.jwtService.decode(checkUser.accessToken);

    return (
      reqToken['sub'] === reqTokenFromDatabase['sub'] &&
      reqToken['iat'] === reqTokenFromDatabase['iat'] &&
      reqToken['exp'] === reqTokenFromDatabase['exp']
    );
  }
}
