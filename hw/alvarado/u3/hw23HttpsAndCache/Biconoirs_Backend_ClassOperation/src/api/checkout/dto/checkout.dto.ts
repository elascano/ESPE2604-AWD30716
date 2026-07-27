import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  delivery_type: string;

  @IsOptional()
  @IsString()
  delivery_address?: string;

  @IsOptional()
  @IsString()
  special_instructions?: string;

  @IsOptional()
  payment?: Record<string, unknown>;
}
