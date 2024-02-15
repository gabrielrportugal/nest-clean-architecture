import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

describe('[SendNotificationUseCase]', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository

  let sut: SendNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a noitification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'New Notification',
      content: 'Notification Content',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
