import { Attachment as PrismaAttachment } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class PrismaQuestionAttachmentMapper {
  public static toDomain(raw: PrismaAttachment): QuestionAttachment {
    const { id, questionId } = raw

    if (!questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityId(questionId),
        attachmentId: new UniqueEntityId(id),
      },
      new UniqueEntityId(id),
    )
  }
}
