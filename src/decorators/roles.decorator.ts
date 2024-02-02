import { SetMetadata } from '@nestjs/common';
import { Roles } from '../helpers/all.enum';

export const Role = (...roles: Roles[]) => SetMetadata('roles', roles);
