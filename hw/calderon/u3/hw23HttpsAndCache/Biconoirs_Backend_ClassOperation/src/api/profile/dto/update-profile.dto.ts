import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  preferences?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  allergies?: string[];
}
