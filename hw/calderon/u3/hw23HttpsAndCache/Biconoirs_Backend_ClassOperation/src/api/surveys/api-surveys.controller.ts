import { Body, Controller, Get, Headers, HttpCode, Param, Post } from "@nestjs/common";
import { ApiSurveysService } from "./api-surveys.service";
import { RespondSurveyDto } from "./dto/respond-survey.dto";

@Controller("api/v1/surveys")
export class ApiSurveysController {
  constructor(private readonly apiSurveysService: ApiSurveysService) {}

  @Get("active")
  findActive() {
    return this.apiSurveysService.findActive();
  }

  @Post(":surveyId/respond")
  @HttpCode(201)
  respond(
    @Headers("x-user-id") userId: string,
    @Param("surveyId") surveyId: string,
    @Body() dto: RespondSurveyDto,
  ) {
    return this.apiSurveysService.respond(userId, surveyId, dto);
  }
}
