import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { randomUUID } from 'crypto';

import { NetService } from '@/service/net.service';
import { OnlinePlayer } from '@/entity/OnlinePlayer';

import { PacketService } from '@/packet/packet.service';
import { TrafficHandler } from '@/packet/handler/TrafficHandler';
import { AbstractPacket } from '@/packet/AbstractPacket';
import { SNetLoginPacket } from '@/packet/server/net/SNetLoginPacket';
import { SNetListPacket } from '@/packet/server/net/SNetListPacket';
import { CNetLoginPacket } from '@/packet/client/net/CNetLoginPacket';

@Injectable()
export class LoginPacketHandler implements TrafficHandler {
	constructor(
		private readonly packetService: PacketService,
		private readonly netService: NetService,
	) {}

	canHandle(pkt: AbstractPacket): boolean {
		return pkt instanceof CNetLoginPacket;
	}

	handle(packet: AbstractPacket, socket: Socket): void {
		const pkt = packet as CNetLoginPacket;
		const identity = this.netService.generateIdentity(pkt.getAccount(), socket);;
		const onlinePlayer = new OnlinePlayer(identity, pkt.getName(), socket);
		this.packetService.addOnlinePlayer(socket.id, onlinePlayer);

		const resPkt = new SNetLoginPacket(true, randomUUID(), identity);
		this.packetService.sendPacket(resPkt, socket);
		// Emit PlayerJoinEvent

		const listPkt = new SNetListPacket(this.packetService.getConnectedSockets());
		this.packetService.broadcast(listPkt);
	}
}
