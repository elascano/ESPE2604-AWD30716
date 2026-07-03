import { Module } from "@nestjs/common";
import { ApiSurveysController } from "./api-surveys.controller";
import { ApiSurveysService } from "./api-surveys.service";

@Module({
  controllers: [ApiSurveysController],
  providers: [ApiSurveysService],
})
export class ApiSurveysModule {}
