import { Body, Controller, Headers, HttpCode, Post } from "@nestjs/common";
import { ApiAuthService } from "./api-auth.service";
import { SignupDto } from "./dto/signup.dto";
import { ApiLoginDto } from "./dto/api-login.dto";
import { PasswordRecoveryDto } from "./dto/password-recovery.dto";

@Controller("api/v1/auth")
export class ApiAuthController {
  constructor(private readonly apiAuthService: ApiAuthService) {}

  @Post("signup")
  @HttpCode(201)
  signup(@Body() dto: SignupDto) {
    return this.apiAuthService.signup(dto);
  }

  @Post("login")
  @HttpCode(200)
  login(@Body() dto: ApiLoginDto) {
    return this.apiAuthService.login(dto);
  }

  @Post("logout")
  @HttpCode(200)
  logout(@Headers("authorization") token: string) {
    return this.apiAuthService.logout(token);
  }

  @Post("password-recovery")
  @HttpCode(200)
  passwordRecovery(@Body() dto: PasswordRecoveryDto) {
    return this.apiAuthService.passwordRecovery(dto);
  }
}
