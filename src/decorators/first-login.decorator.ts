import { SetMetadata } from '@nestjs/common';
import { firstLogin } from '../../config/config';

export const FirstLogin = () => SetMetadata(firstLogin, true);
