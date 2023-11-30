import { ulid } from 'ulidx';

import { ApplicationService } from '@/application/ApplicationService';

import { Message } from '@/domain/communication/model/Message';
import { ULID } from '@/domain/communication/model/ULID';
import { Player } from '@/domain/communication/model/Player';
import { DomainEventPublisher } from '@/domain/DomainEventPublisher';

interface ChatInput {
	fromId: string;
	message: string;
}

export class Chat implements ApplicationService<ChatInput, {}> {
	execute(input: ChatInput): Promise<{}> {
		try {
			const [error, message] = Message.createMessage({
				id: new ULID(ulid()),
				type: 'chat',
				to: new Player({
					id: new ULID(ulid()),
				}),
				from: new Player({
					id: new ULID(input.fromId),
				}),
				content: input.message,
			});

			message.chat();

			DomainEventPublisher.getInstance().publishAll(message.domainEvents);
			return;
		} catch {}
	}
}
