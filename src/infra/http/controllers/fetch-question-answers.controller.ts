import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { QuestionPresenter } from '../presenters/question-presenter'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '../presenters/answer-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1).default(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type QueryParamsSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswersUC: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: QueryParamsSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswersUC.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answers } = result.value

    return { answers: answers.map(AnswerPresenter.toHttp) }
  }
}
