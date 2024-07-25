import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

describe('[UploadAndCreateAttachmentUseCase]', () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let fakeUploader: FakeUploader
  let sut: UploadAndCreateAttachmentUseCase

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able upload and create an attachment', async () => {
    const fileName = 'profile.png'

    const result = await sut.execute({
      fileName,
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName,
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'favorite-song.mp3',
      fileType: 'audio/mp3',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
