import { SetMetadata } from '@nestjs/common';
import { metaKey } from '../../config/config';

export const Public = () => SetMetadata(metaKey, true);
