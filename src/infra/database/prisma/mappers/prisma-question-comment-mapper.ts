import { Comment as PrismaComment, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class PrismaQuestionCommentMapper {
  public static toDomain(raw: PrismaComment): QuestionComment {
    const { id, questionId, authorId, content, createdAt, updatedAt } = raw

    if (!questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionComment.create(
      {
        content,
        authorId: new UniqueEntityId(authorId),
        questionId: new UniqueEntityId(questionId),
        createdAt,
        updatedAt,
      },
      new UniqueEntityId(id),
    )
  }

  public static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    const { id, authorId, content, questionId, createdAt, updatedAt } =
      questionComment

    return {
      id: id.toString(),
      authorId: authorId.toString(),
      questionId: questionId.toString(),
      content,
      createdAt,
      updatedAt,
    }
  }
}
