import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationsController {
  constructor(private readNotificationUC: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const { sub: userId } = user

    const result = await this.readNotificationUC.execute({
      notificationId,
      recipientId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
