import { Injectable } from '@nestjs/common';
import { refresh_strategy } from '../../config/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshGuard extends AuthGuard(refresh_strategy) {
  constructor() {
    super();
  }
}
