import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  appPort,
  swaggerDescription,
  swaggerDocs,
  swaggerTitle,
  swaggerVersion,
} from '../config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseTransformInterceptor } from './interceptors/response.transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.enableCors();
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .addTag(swaggerDocs)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: { docExpansion: 'none', persistAuthorization: true },
  });
  await app.listen(appPort);
}

bootstrap();
