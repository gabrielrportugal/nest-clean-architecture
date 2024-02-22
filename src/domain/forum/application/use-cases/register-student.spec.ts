import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

describe('[RegisterStudentUseCase]', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let fakeHasher: FakeHasher

  let sut: RegisterStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'German Cano',
      email: 'german.cano@gol.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const password = '123456'

    const result = await sut.execute({
      name: 'German Cano',
      email: 'german.cano@gol.com',
      password,
    })

    const hashedPassword = await fakeHasher.hash(password)

    expect(result.isRight()).toBe(true)

    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
