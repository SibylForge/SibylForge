import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { PacketService } from '@/packet/packet.service';
import { AbstractPacket } from '@/packet/AbstractPacket';
import { CPlayerChatPacket } from '@/packet/client/player/CPlayerChatPacket';
import { SPlayerChatPacket } from '@/packet/server/player/SPlayerChatPacket';
import { TrafficHandler } from '@/packet/handler/TrafficHandler';

@Injectable()
export class ChatPacketHandler implements TrafficHandler {
	constructor(
		private readonly packetService: PacketService,
	) {}

	canHandle(pkt: AbstractPacket): boolean {
		return pkt instanceof CPlayerChatPacket;
	}

	handle(packet: AbstractPacket, socket: Socket): void {
		const pkt = packet as CPlayerChatPacket;
		const fromOnlinePlayer = this.packetService.getOnlinePlayer(socket.id);
		const fromUUID = fromOnlinePlayer.getUUID();
		const message = pkt.getMessage();
		const resPkt = new SPlayerChatPacket(fromUUID, message);
		this.packetService.broadcast(resPkt);
	}
}
