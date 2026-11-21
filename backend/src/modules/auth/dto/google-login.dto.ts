import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  // Google ID tokens are ~1-2 KB; reject oversized bodies before verifying.
  @MaxLength(4096)
  credential!: string;
}
