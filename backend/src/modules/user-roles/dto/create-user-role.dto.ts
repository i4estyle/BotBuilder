import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  roleId!: string;
}
