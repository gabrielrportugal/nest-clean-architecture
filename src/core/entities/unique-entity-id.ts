import { randomUUID } from 'crypto'

export class UniqueEntityId {
  private value: string

  public toString() {
    return this.value
  }

  public toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  public equals(id: UniqueEntityId): boolean {
    return id.toValue() === this.value
  }
}
