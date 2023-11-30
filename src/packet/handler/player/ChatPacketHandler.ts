import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { PacketService } from '@/packet/packet.service';
import { AbstractPacket } from '@/packet/AbstractPacket';
import { CPlayerChatPacket } from '@/packet/client/player/CPlayerChatPacket';
import { SPlayerChatPacket } from '@/packet/server/player/SPlayerChatPacket';
import { TrafficHandler } from '@/packet/handler/TrafficHandler';
import { Chat } from '@/application/communication/Chat';

import { DomainEventPublisher } from '@/domain/DomainEventPublisher';
import { Chatted } from '@/domain/communication/event/Chatted';

@Injectable()
export class ChatPacketHandler implements TrafficHandler {
	private readonly chatService: Chat;

	constructor(
		private readonly packetService: PacketService,
	) {
		DomainEventPublisher.getInstance().register(Chatted.name, this.handleEvent.bind(this));
		this.chatService = new Chat();
	}

	canHandle(pkt: AbstractPacket): boolean {
		return pkt instanceof CPlayerChatPacket;
	}

	handle(packet: AbstractPacket, socket: Socket): void {
		const fromOnlinePlayer = this.packetService.getOnlinePlayer(socket.id);
		const pkt = packet as CPlayerChatPacket;
		this.chatService.execute({
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
}
