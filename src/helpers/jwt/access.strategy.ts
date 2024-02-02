import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { access_secret_key, access_strategy } from '../../../config/config';
import { UsersService } from '../../routes/users/users.service';
import { JwtPayload } from './jwt.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  access_strategy,
) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: access_secret_key,
      passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
