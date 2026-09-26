import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(100)
  loginName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}
