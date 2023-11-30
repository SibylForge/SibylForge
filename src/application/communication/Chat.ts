import { ulid } from 'ulidx';

import { ApplicationService } from '@/application/ApplicationService';
import { PacketProjector } from '@/application/shared/packet/PacketProjector';

import { DomainEventPublisher } from '@/domain/shared/DomainEventPublisher';
import { Chatted } from '@/domain/communication/event/Chatted';
import { Message } from '@/domain/communication/model/Message';
import { ULID } from '@/domain/communication/model/ULID';
import { Player } from '@/domain/communication/model/Player';
import { Mapper } from '@/domain/communication/infrastructure/Mapper';

interface ChatInput {
	fromId: string;
	message: string;
}

export class Chat implements ApplicationService<ChatInput, {}> {
	constructor(
		private readonly projector: PacketProjector,
	) {
		DomainEventPublisher.getInstance().register(Chatted.name, this.handleEvent.bind(this));
	}

	handleEvent(event: Chatted): void {
		const message = event.getMessage();
		const resPkt = new Mapper().toServerPacket(message);
		this.projector.sendAll(resPkt);
	}

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
