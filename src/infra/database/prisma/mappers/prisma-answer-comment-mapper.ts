import { Comment as PrismaComment, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class PrismaAnswerCommentMapper {
  public static toDomain(raw: PrismaComment): AnswerComment {
    const { id, answerId, authorId, content, createdAt, updatedAt } = raw

    if (!answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        content,
        authorId: new UniqueEntityId(authorId),
        answerId: new UniqueEntityId(answerId),
        createdAt,
        updatedAt,
      },
      new UniqueEntityId(id),
    )
  }

  public static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    const { id, authorId, content, answerId, createdAt, updatedAt } =
      answerComment

    return {
      id: id.toString(),
      authorId: authorId.toString(),
      answerId: answerId.toString(),
      content,
      createdAt,
      updatedAt,
    }
  }
}
