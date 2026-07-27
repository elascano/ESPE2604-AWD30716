import { Body, Controller, Get, Headers, Patch, Put } from "@nestjs/common";
import { ApiProfileService } from "./api-profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("api/v1/profile")
export class ApiProfileController {
  constructor(private readonly apiProfileService: ApiProfileService) {}

  @Get()
  getProfile(@Headers("x-user-id") userId: string) {
    return this.apiProfileService.getProfile(userId);
  }

  @Put()
  updatePut(@Headers("x-user-id") userId: string, @Body() dto: UpdateProfileDto) {
    return this.apiProfileService.update(userId, dto);
  }

  @Patch()
  updatePatch(@Headers("x-user-id") userId: string, @Body() dto: UpdateProfileDto) {
    return this.apiProfileService.update(userId, dto);
  }
}
