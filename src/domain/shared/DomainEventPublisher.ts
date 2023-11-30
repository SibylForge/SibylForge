import { DomainEvent } from './DomainEvent';

type DomainEventHandler<T> = (event: T) => void;

export class DomainEventPublisher {
  private static instance: DomainEventPublisher;
  private handlersMap: {
    [index: string]: Array<DomainEventHandler<DomainEvent>>;
  };

  private constructor() {
    this.handlersMap = {};
  }

  static getInstance(): DomainEventPublisher {
    if (!DomainEventPublisher.instance) {
      DomainEventPublisher.instance = new DomainEventPublisher();
    }
    return DomainEventPublisher.instance;
  }

  register<T extends DomainEvent>(
    eventName: string,
    eventHandler: DomainEventHandler<T>
  ): void {
    if (!this.handlersMap.hasOwnProperty(eventName)) {
      this.handlersMap[eventName] = [
        eventHandler as DomainEventHandler<DomainEvent>
      ];
    } else {
      this.handlersMap[eventName].push(eventHandler as DomainEventHandler<
        DomainEvent
      >);
    }
  }

  clearHandlers(eventName): void {
    this.handlersMap[eventName] = [];
  }

  publish(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name;
    if (this.handlersMap.hasOwnProperty(eventClassName)) {
      const handlers: Array<DomainEventHandler<DomainEvent>> = this.handlersMap[
        eventClassName
      ];
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  publishAll(events: DomainEvent[]): void {
    for (const event of events) {
      this.publish(event);
    }
  }
}
