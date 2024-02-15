/* eslint-disable no-use-before-define */
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('[DomainEvents]', () => {
  it('should be able to dispatch and listen to events', () => {
    // Funcão de callback que será executada quando evento por disparado
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (Registrou um subscriber para ouvir o evento 'CustomAggregateCreated')
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Criando uma entidade do tipo CustomAggregate que irá registrar um novo evento
    const aggregate = CustomAggregate.create()

    // Evento criado e inserido na lista de DomainEvents porém NÃO foi executado ainda
    expect(aggregate.domainEvents).toHaveLength(1)

    // Disparando todos os DomainEvents do agregado com este ID
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Confere que a funcão callbackSpy foi executada após disparo dos eventos
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
