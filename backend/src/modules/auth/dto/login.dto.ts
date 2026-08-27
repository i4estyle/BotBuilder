import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  userEmail!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}
