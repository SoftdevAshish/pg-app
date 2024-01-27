import { Module } from '@nestjs/common';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import {
  database,
  host,
  logging,
  password,
  port,
  synchronize,
  user,
} from '../../config/config';

@Module({
  imports: [
    TypeOrmCoreModule.forRoot({
      type: 'postgres',
      host: host,
      port: port,
      username: user,
      password: password,
      database: database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: synchronize,
      migrations: ['migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      logging: logging,
    }),
  ],
})
export class DatabaseModule {}
