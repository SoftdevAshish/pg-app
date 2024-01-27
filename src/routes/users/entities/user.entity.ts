import CommonColumn from '../../../helpers/CommonColumn';
import { Column, Entity } from 'typeorm';
import { Roles } from '../../../helpers/all.enum';

@Entity({ name: 'users' })
export class User extends CommonColumn {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  isChangePassword: boolean;

  @Column()
  isActive: boolean;

  @Column()
  lastLoginDate: Date;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.users })
  roles: Roles;
}
