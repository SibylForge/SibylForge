import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { TrafficHandler } from '@/application/shared/packet/TrafficHandler';

import { PacketService } from '@/packet/packet.service';
import { AbstractPacket } from '@/packet/AbstractPacket';
import { CNetLogoutPacket } from '@/packet/client/net/CNetLogoutPacket';
import { SNetListPacket } from '@/packet/server/net/SNetListPacket';

@Injectable()
export class LogoutPacketHandler implements TrafficHandler {
	constructor(
		private readonly packetService: PacketService,
	) {}

	canHandle(pkt: AbstractPacket): boolean {
		return pkt instanceof CNetLogoutPacket;
	}

	handle(packet: AbstractPacket, socket: Socket): void {
		const isConnected = this.packetService.isConnectedSocket(socket.id);

		this.packetService.removeOnlinePlayer(socket.id);
		// Emit PlayerLeaveEvent

		const listPkt = new SNetListPacket(this.packetService.getConnectedSockets());
		this.packetService.broadcast(listPkt);
	}
}
