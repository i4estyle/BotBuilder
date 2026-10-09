import {
  IsEmail,
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  loginName!: string;
  @IsEmail()
  @MaxLength(100)
  email!: string;
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password!: string;
}
