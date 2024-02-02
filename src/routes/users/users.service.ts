import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { errorMessage } from '../../utils/response';
import { User } from './entities/user.entity';
import {
  genPass,
  isMatchedPassword,
  validateEmail,
} from '../../utils/check-string';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  access_secret_key,
  access_secret_key_expire_time,
  refresh_secret_key,
  refresh_secret_key_expire_time,
} from '../../../config/config';
import { PasswordDto } from './dto/password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, phone } = createUserDto;
    if (
      !name ||
      name === '' ||
      !email ||
      email === '' ||
      !phone ||
      phone === ''
    ) {
      errorMessage(
        'Please Verify and check your enter Data and re-try again.',
        'name, email, phone, password',
      );
    }
    const checkEmailInDatabase = await this.userRepository.findOne({
      where: { email },
    });
    if (checkEmailInDatabase) {
      errorMessage(
        'Please Enter Valid E-Mail. This E-Mail already exist so you can use other email.',
        'email',
      );
    }
    if (!validateEmail(email)) {
      errorMessage('Please enter valid E-Mail.', 'email');
    }
    const createUser = new User();
    createUser.name = name;
    createUser.phone = phone;
    createUser.email = email;
    createUser.password = genPass({ name, email, phone });
    createUser.isChangePassword = false;
    createUser.isActive = true;
    const mailOption = {
      to: createUser.email,
      subject: 'Account Created',
      tmp: 'register-user',
      context: {
        name: createUser.name,
        email: createUser.email,
        password: createUser.password,
      },
    };
    console.log(createUser, ' User Details.');
    const saveNewUser = await this.userRepository.save(createUser);
    if (saveNewUser) this.mailService.sendMail(mailOption);
    return saveNewUser;
  }

  async findById(id: number) {
    return await this.userRepository.findOneOrFail({ where: { id } });
  }

  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    if (!email || email === '' || !password || password === '')
      errorMessage('Sorry Credential Not Match', 'email, password');
    const checkEmail = await this.userRepository.findOneByOrFail({ email });

    if (!checkEmail)
      errorMessage('Sorry Credential Not Match', 'email, password');
    const checkPassword = await isMatchedPassword(
      password,
      checkEmail.password,
    );

    if (checkPassword) {
      const { access_token, refresh_token } = await this.generateToken({
        userId: checkEmail.id,
        email: checkEmail.email,
        roles: checkEmail.roles,
      });
      checkEmail.lastLoginDate = new Date();
      checkEmail.accessToken = access_token;
      checkEmail.refreshToken = refresh_token;
      const gotUser = new User();
      gotUser.id = checkEmail.id;
      gotUser.lastLoginDate = new Date();
      gotUser.accessToken = access_token;
      gotUser.refreshToken = refresh_token;
      await this.userRepository.save(gotUser);
    } else {
      errorMessage('Sorry Credential Not Match', 'email, password');
    }
    return checkEmail;
  }

  async generateToken({
    userId,
    email,
    roles,
  }: {
    userId: number;
    email: string;
    roles: any;
  }) {
    const jwtPayload = { sub: userId, roles, email };

    const [access, refresh] = [
      await this.jwtService.signAsync(jwtPayload, {
        secret: access_secret_key,
        expiresIn: access_secret_key_expire_time,
      }),
      await this.jwtService.signAsync(jwtPayload, {
        secret: refresh_secret_key,
        expiresIn: refresh_secret_key_expire_time,
      }),
    ];
    return { access_token: access, refresh_token: refresh };
  }

  async isChangePassword(id: number, password: PasswordDto) {
    const { oldPassword, newPassword } = password;
    if (
      !oldPassword ||
      oldPassword === '' ||
      !newPassword ||
      newPassword === ''
    ) {
      errorMessage('please Enter Valid Password', 'oldPassword, newPassword');
    }
    const gotUser = await this.userRepository.findOneOrFail({ where: { id } });
    const isMatchedPass = isMatchedPassword(oldPassword, gotUser.password);
    if (!isMatchedPass) {
      errorMessage(
        'Your Password Is Not Matched please verify and try again',
        'password',
      );
    }
    gotUser.password = newPassword;
    gotUser.isChangePassword = true;
    return await this.userRepository.save(gotUser);
  }

  async logout(id: number) {
    const checkUser = await this.userRepository.findOneOrFail({
      where: { id },
    });
    if (
      !checkUser.accessToken ||
      checkUser.accessToken === '' ||
      checkUser.accessToken === null
    ) {
      errorMessage('Please Login First then try again', 'logout');
    }
    const gotUser = new User();
    gotUser.id = checkUser.id;
    gotUser.accessToken = null;
    gotUser.refreshToken = null;
    await this.userRepository.save(gotUser);
    return checkUser;
  }
}
