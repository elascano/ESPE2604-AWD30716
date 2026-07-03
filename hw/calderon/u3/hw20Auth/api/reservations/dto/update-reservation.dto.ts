import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateReservationDto {
  @IsOptional()
  @IsString()
  reservation_time?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  party_size?: number;
}
