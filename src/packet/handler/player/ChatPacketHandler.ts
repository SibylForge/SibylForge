import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { Chat } from '@/application/communication/Chat';
import { TrafficHandler } from '@/application/shared/packet/TrafficHandler';

import { PacketService } from '@/packet/packet.service';
import { AbstractPacket } from '@/packet/AbstractPacket';
import { CPlayerChatPacket } from '@/packet/client/player/CPlayerChatPacket';

@Injectable()
export class ChatPacketHandler implements TrafficHandler {
	private readonly chatService: Chat;

	constructor(
		private readonly packetService: PacketService,
	) {
		this.chatService = new Chat(packetService);
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
}
