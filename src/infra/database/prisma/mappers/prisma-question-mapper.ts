import { Question as PrismaQuestion, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  public static toDomain(raw: PrismaQuestion): Question {
    const {
      id,
      slug,
      title,
      authorId,
      content,
      bestAnswerId,
      createdAt,
      updatedAt,
    } = raw

    return Question.create(
      {
        slug: Slug.create(slug),
        title,
        authorId: new UniqueEntityId(authorId),
        bestAnswerId: bestAnswerId ? new UniqueEntityId(bestAnswerId) : null,
        content,
        createdAt,
        updatedAt,
      },
      new UniqueEntityId(id),
    )
  }

  public static toPrisma(
    question: Question,
  ): Prisma.QuestionUncheckedCreateInput {
    const {
      id,
      slug,
      title,
      authorId,
      content,
      bestAnswerId,
      createdAt,
      updatedAt,
    } = question

    return {
      id: id.toString(),
      authorId: authorId.toString(),
      bestAnswerId: bestAnswerId?.toString(),
      title,
      content,
      slug: slug.value,
      createdAt,
      updatedAt,
    }
  }
}
