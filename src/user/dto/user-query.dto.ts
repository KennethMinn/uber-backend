import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;
}
