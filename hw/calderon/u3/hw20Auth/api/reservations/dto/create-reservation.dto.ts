import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateReservationDto {
  @IsDateString()
  reservation_date: string;

  @IsString()
  @IsNotEmpty()
  reservation_time: string;

  @IsInt()
  @Min(1)
  party_size: number;

  @IsOptional()
  @IsString()
  special_requests?: string;
}
