import { Module } from "@nestjs/common";
import { ApiProfileController } from "./api-profile.controller";
import { ApiProfileService } from "./api-profile.service";

@Module({
  controllers: [ApiProfileController],
  providers: [ApiProfileService],
})
export class ApiProfileModule {}
