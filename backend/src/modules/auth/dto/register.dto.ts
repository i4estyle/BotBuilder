import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() @MaxLength(50)
  userName!: string;
  @IsEmail() @IsNotEmpty() @MaxLength(100)
  userEmail!: string;
  @IsOptional() @IsString() @Matches(/^[0-9+()\-\s]{9,15}$/) @MaxLength(15)
  userPhone?: string;
  @IsString() @IsNotEmpty() @IsIn(['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER'])
  guardianRelation!: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  @IsString() @MinLength(8) @MaxLength(255)
  password!: string;
  @IsString() @IsNotEmpty() @MinLength(8) @MaxLength(8)
  childAccessCode!: string;
}
