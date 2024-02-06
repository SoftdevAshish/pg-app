import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { successMessage } from '../../utils/response';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../decorators/public.decorator';
import { PasswordDto } from './dto/password.dto';
import { CurrentUserId } from '../../decorators/current-user-id';
import { FirstLogin } from '../../decorators/first-login.decorator';
import { Role } from '../../decorators/roles.decorator';
import { Roles } from '../../helpers/all.enum';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users ')
@ApiBearerAuth('token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: `Create new Users.`,
  })
  @Public()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return successMessage(
        'User Register Successful',
        await this.usersService.create(createUserDto),
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: `Login  Users.`,
  })
  @Public()
  @Post('/login')
  async login(@Body() loginData: LoginDto) {
    try {
      return successMessage(
        'Login Successful',
        await this.usersService.login(loginData),
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: ` Get Users By Id.`,
  })
  @Role(Roles.admin)
  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      return successMessage(
        'Get User Data By Id',
        await this.usersService.findById(id),
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: `Users Profile.`,
  })
  @Post('profile')
  async profile(@CurrentUserId() id: number) {
    try {
      return successMessage(
        'Get Users Profile',
        await this.usersService.findById(id),
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: `User Change Password after first login.`,
  })
  @FirstLogin()
  @Put('change/password')
  async isChangePassword(
    @CurrentUserId() id: number,
    @Body() password: PasswordDto,
  ) {
    try {
      return successMessage(
        'Changed Password.',
        await this.usersService.isChangePassword(id, password),
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: `Logout  Users.`,
  })
  @Put('logout')
  async logout(@CurrentUserId() id: number) {
    try {
      return successMessage(
        'Logout Successful.',
        await this.usersService.logout(id),
      );
    } catch (e) {
      throw e;
    }
  }
}
