import CommonColumn from '../../../helpers/CommonColumn';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { Roles } from '../../../helpers/all.enum';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends CommonColumn {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({ default: false })
  isChangePassword: boolean;

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({ type: 'timestamptz', nullable: true })
  lastLoginDate: Date;

  @Column({ nullable: true, default: '' })
  accessToken: string;

  @Column({ nullable: true, default: '' })
  refreshToken: string;

  @Exclude()
  @Column({ type: 'enum', enum: Roles, default: Roles.users })
  roles: Roles;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = 10;
    if (
      this.password !== null &&
      this.password !== undefined &&
      this.password !== ''
    )
      this.password = await bcrypt.hash(this.password, salt);
  }
}
