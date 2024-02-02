import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailService } from '../mail/mail.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessStrategy } from '../../helpers/jwt/access.strategy';
import { RefreshStrategy } from '../../helpers/jwt/refresh.strategy';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [UsersController],
  providers: [
    UsersService,
    MailService,
    JwtService,
    AccessStrategy,
    RefreshStrategy,
    Reflector,
  ],
  exports: [JwtModule, UsersService],
})
export class UsersModule {}
