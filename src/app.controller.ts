import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { databaseConfiguration } from '../config/data-source';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(databaseConfiguration);
    return this.appService.getHello();
  }
}
