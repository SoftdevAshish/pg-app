import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appPort } from '../config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(appPort);
}
bootstrap();
