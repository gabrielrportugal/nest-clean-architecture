import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Controller('/answers/comments/:answerCommentId')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerCommentUC: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerCommentId') answerCommentId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteAnswerCommentUC.execute({
      authorId: userId,
      answerCommentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
