import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

describe('[CommentOnAnswerUseCase]', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  let sut: CommentOnAnswerUseCase

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comment test',
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Comment test',
    )
  })
})
