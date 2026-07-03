import { IsArray, IsNotEmpty, IsString, ArrayMinSize, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class SurveyAnswerDto {
  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class RespondSurveyDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SurveyAnswerDto)
  responses: SurveyAnswerDto[];
}
