import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { access_secret_key } from '../../config/config';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const decodedToken = jwt.verify(requestToken, access_secret_key);
    return decodedToken['sub'];
  },
);
