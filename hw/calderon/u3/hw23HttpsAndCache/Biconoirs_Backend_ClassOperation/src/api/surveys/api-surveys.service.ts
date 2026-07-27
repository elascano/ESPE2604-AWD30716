import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RespondSurveyDto } from "./dto/respond-survey.dto";

@Injectable()
export class ApiSurveysService {
  constructor(private readonly prisma: PrismaService) {}

  async findActive() {
    return this.prisma.survey.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    });
  }

  async respond(userId: string, surveyId: string, dto: RespondSurveyDto) {
    const survey = await this.prisma.survey.findUnique({ where: { surveyId } });

    if (!survey) {
      throw new NotFoundException("Survey not found");
    }

    if (!dto.responses || dto.responses.length === 0) {
      throw new BadRequestException("responses array is required and must not be empty");
    }

    const data = dto.responses.map((r) => ({
      surveyId,
      userId: userId ?? null,
      questionId: r.question_id,
      answer: r.answer,
    }));

    await this.prisma.surveyResponse.createMany({ data });

    return { message: "Response submitted successfully", surveyId };
  }
}
