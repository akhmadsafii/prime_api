import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['Admin', 'Developer', 'Analyst'])
  role: User['role'];
}