import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './routes/users/users.module';
import { MailService } from './routes/mail/mail.service';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AccessGuard } from './guards/access.guard';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [DatabaseModule, UsersModule, JwtModule],
  controllers: [],
  providers: [
    MailService,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
