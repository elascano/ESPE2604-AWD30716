import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ApiLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
