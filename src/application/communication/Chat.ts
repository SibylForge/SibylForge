import { Injectable } from '@nestjs/common';
import { ulid } from 'ulidx';
import { Socket } from 'socket.io';

import { ApplicationService } from '@/application/ApplicationService';
import { TrafficHandler } from '@/application/shared/packet/TrafficHandler';

import { DomainEventPublisher } from '@/domain/shared/DomainEventPublisher';
import { Chatted } from '@/domain/communication/event/Chatted';
import { Message } from '@/domain/communication/model/Message';
import { ULID } from '@/domain/communication/model/ULID';
import { Player } from '@/domain/communication/model/Player';

import { AbstractPacket } from '@/packet/AbstractPacket';
import { SPlayerChatPacket } from '@/packet/server/player/SPlayerChatPacket';
import { CPlayerChatPacket } from '@/packet/client/player/CPlayerChatPacket';
import { PacketService } from '@/packet/packet.service';

interface ChatInput {
	fromId: string;
	message: string;
}

@Injectable()
export class Chat implements ApplicationService<ChatInput, {}>, TrafficHandler {
	constructor(
		private readonly packetService: PacketService,
	) {
		DomainEventPublisher.getInstance().register(Chatted.name, this.handleEvent.bind(this));
	}

	canHandle(pkt: AbstractPacket): boolean {
		return pkt instanceof CPlayerChatPacket;
	}

	handle(packet: AbstractPacket, socket: Socket): void {
		const fromOnlinePlayer = this.packetService.getOnlinePlayer(socket.id);
		const pkt = packet as CPlayerChatPacket;
		this.execute({
			fromId: fromOnlinePlayer.getULID(),
			message: pkt.getMessage(),
		});
	}

	handleEvent(event: Chatted): void {
		const message = event.getMessage();
		const from = message.getFrom().getId();
		const content = message.getContent();

		const resPkt = new SPlayerChatPacket(from, content);
		this.packetService.broadcast(resPkt);
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
