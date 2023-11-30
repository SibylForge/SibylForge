import { DomainEvent } from '@/domain/shared/DomainEvent';

import { Message } from '../model/Message';

export class Chatted extends DomainEvent {
	constructor(
		private readonly message: Message,
	) {
		super();
	}

	getMessage(): Message {
		return this.message;
	}
}
