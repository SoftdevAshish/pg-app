import { DataSource, DataSourceOptions } from 'typeorm';
import {
  database,
  host,
  logging,
  password,
  port,
  synchronize,
  user,
} from './config';
import { SeederOptions } from 'typeorm-extension';

export const databaseConfiguration: DataSourceOptions & SeederOptions = {
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
  seeds: ['seeds/**/*.seeder.ts'],
};

const dataSource = new DataSource(databaseConfiguration);

export default dataSource;
