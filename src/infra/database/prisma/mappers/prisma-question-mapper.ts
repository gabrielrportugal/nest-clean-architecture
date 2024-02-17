import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from '@prisma/client'

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
}
