import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  Length,
  MaxLength,
} from 'class-validator';
import { UserStatus } from '../../../common/enums/user-status.enum.js';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  userName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  netionalId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  userAddress!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  userPhone!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  userEmail!: string;

  @IsEnum(UserStatus)
  userStatus!: UserStatus;
}
