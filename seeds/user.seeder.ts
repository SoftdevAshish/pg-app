import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../src/routes/users/entities/user.entity';
import { Roles } from '../src/helpers/all.enum';

export default class UserSeeder implements Seeder {
  public async run(datasource: DataSource) {
    await datasource.query('TRUNCATE "users" RESTART IDENTITY CASCADE;');
    const repository = datasource.getRepository(User);
    const defaultUser = new User();
    defaultUser.name = 'PG App';
    defaultUser.email = 'portfolio.generator.app@gmail.com';
    defaultUser.phone = '97616216864';
    defaultUser.password = 'pg-app@2024';
    defaultUser.isChangePassword = true;
    defaultUser.isActive = true;
    defaultUser.accessToken = null;
    defaultUser.refreshToken = null;
    defaultUser.roles = Roles.superAdmin;

    await repository.save(defaultUser);
  }
}
