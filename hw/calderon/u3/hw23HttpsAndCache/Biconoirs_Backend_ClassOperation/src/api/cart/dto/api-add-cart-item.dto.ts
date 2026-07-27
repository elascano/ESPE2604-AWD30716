import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class ApiAddCartItemDto {
  @IsString()
  @IsNotEmpty()
  dish_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
