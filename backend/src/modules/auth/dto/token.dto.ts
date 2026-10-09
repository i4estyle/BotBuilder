import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  token!: string;
}
