import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { refresh_secret_key, refresh_strategy } from '../../../config/config';
import { Request } from 'express';
import { JwtPayload, JwtPayloadRefresh } from './jwt.type';
import { unauthorizedErrorMessage } from '../../utils/response';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  refresh_strategy,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refresh_secret_key,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadRefresh {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();
    if (!refreshToken) unauthorizedErrorMessage('Token Error', 'Token');

    return { ...payload, refreshToken };
  }
}
