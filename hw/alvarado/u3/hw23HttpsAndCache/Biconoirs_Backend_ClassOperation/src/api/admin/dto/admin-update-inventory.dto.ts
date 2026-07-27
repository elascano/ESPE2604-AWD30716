import { IsDateString, IsNumber, IsOptional, Min } from "class-validator";

export class AdminUpdateInventoryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  current_stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorder_level?: number;

  @IsOptional()
  @IsDateString()
  expiry_date?: string;
}
