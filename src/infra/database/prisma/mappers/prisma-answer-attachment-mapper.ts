import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class PrismaAnswerAttachmentMapper {
  public static toDomain(raw: PrismaAttachment): AnswerAttachment {
    const { id, answerId } = raw

    if (!answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(answerId),
        attachmentId: new UniqueEntityId(id),
      },
      new UniqueEntityId(id),
    )
  }

  static toPrismaUpdateMany(
    answerAttachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = answerAttachments.map((att) =>
      att.attachmentId.toString(),
    )
    const answerId = answerAttachments[0].answerId.toString()

    return {
      where: { id: { in: attachmentIds } },
      data: {
        answerId,
      },
    }
  }
}
