import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

import { TrafficHandler } from '@/application/shared/packet/TrafficHandler';
import { AbstractPacket } from '@/application/shared/packet/AbstractPacket';

import { OnlinePlayer } from '@/entity/OnlinePlayer';
import { PacketService } from '@/packet/packet.service';
import { SNetLoginPacket } from '@/packet/server/net/SNetLoginPacket';
import { SNetListPacket } from '@/packet/server/net/SNetListPacket';
import { CNetLoginPacket } from '@/packet/client/net/CNetLoginPacket';

@Injectable()
export class LoginPacketHandler implements TrafficHandler {
	constructor(
		private readonly jwtService: JwtService,
		private readonly packetService: PacketService,
	) {}

	canHandle(pkt: AbstractPacket): boolean {
		return pkt instanceof CNetLoginPacket;
	}

	handle(packet: AbstractPacket, socket: Socket): void {
		const pkt = packet as CNetLoginPacket;
		const { account, name } = this.jwtService.decode<{ account: string; name: string; }>(pkt.getToken());

		const identity = this.packetService.generateIdentity(account, socket);;
		const onlinePlayer = new OnlinePlayer(identity, name, socket);
		this.packetService.addOnlinePlayer(socket.id, onlinePlayer);

		const resPkt = new SNetLoginPacket(true, onlinePlayer);
		this.packetService.sendPacket(resPkt, socket);
		// Emit PlayerJoinEvent

		const listPkt = new SNetListPacket(this.packetService.getConnectedSockets());
		this.packetService.broadcast(listPkt);
	}
}
