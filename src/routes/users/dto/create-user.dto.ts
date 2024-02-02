import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: ' example= Ashish Timalsina' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: ' example=ashish@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: ' example= +977 97616256864' })
  @IsNotEmpty()
  phone: string;
}
