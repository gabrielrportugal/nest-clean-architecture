import { Answer as PrismaAnswer, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class PrismaAnswerMapper {
  public static toDomain(raw: PrismaAnswer): Answer {
    const { id, questionId, authorId, content, createdAt, updatedAt } = raw

    return Answer.create(
      {
        content,
        questionId: new UniqueEntityId(questionId),
        authorId: new UniqueEntityId(authorId),
        createdAt,
        updatedAt,
      },
      new UniqueEntityId(id),
    )
  }

  public static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    const { id, authorId, content, questionId, createdAt, updatedAt } = answer

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
