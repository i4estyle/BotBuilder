import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserStatus } from '../../../common/enums/user-status.enum.js';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;
}

export class UpdateAdminStatusDto {
  @IsIn([UserStatus.ACTIVE, UserStatus.SUSPENDED])
  status!: UserStatus.ACTIVE | UserStatus.SUSPENDED;
}
