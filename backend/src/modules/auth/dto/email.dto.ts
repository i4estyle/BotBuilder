import { IsEmail, MaxLength } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @MaxLength(100)
  email!: string;
}
