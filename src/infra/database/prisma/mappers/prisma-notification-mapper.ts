import { Notification as PrismaNotification, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class PrismaNotificationMapper {
  public static toDomain(raw: PrismaNotification): Notification {
    const { id, title, content, createdAt, readAt, recipientId } = raw

    return Notification.create(
      {
        title,
        content,
        createdAt,
        readAt,
        recipientId: new UniqueEntityId(recipientId),
      },
      new UniqueEntityId(id),
    )
  }

  public static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    const { id, readAt, recipientId, title, content, createdAt } = notification

    return {
      id: id.toString(),
      title,
      content,
      createdAt,
      recipientId: recipientId.toString(),
      readAt,
    }
  }
}
