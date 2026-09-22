import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateChildAccessCodeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  childName!: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  enrollment!: string;
  @IsOptional()
  @IsString()
  @MaxLength(8)
  accessCode?: string;
}
