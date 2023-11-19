import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { randomUUID } from 'crypto';

import { OnlinePlayer } from '@/entity/OnlinePlayer';

import { ServerPacket } from './server/ServerPacket';

@Injectable()
export class PacketService{
	public uuid = randomUUID();
	private connectedSockets: Record<string, OnlinePlayer> = {};

	sendPacket(pkt: ServerPacket, socket: Socket) {
		const data = this.formPktName(
			pkt.formPayload().formHead(),
			pkt,
		);
		socket.emit('spkt', JSON.stringify(data));
	}

	public getConnectedSockets(): Record<string, OnlinePlayer> {
		return this.connectedSockets;
	}

	public getOnlinePlayer(socketId: string): OnlinePlayer {
		return this.connectedSockets[socketId];
	}

	public addOnlinePlayer(socketId: string, player: OnlinePlayer): void {
		this.connectedSockets[socketId] = player;
	}

	public isConnectedSocket(socketId: string): boolean {
		return this.getOnlinePlayer(socketId) !== undefined;
	}

	public broadcast(pkt: ServerPacket): void {
		Object.values(this.connectedSockets).forEach((onlinePlayer) => {
			this.sendPacket(pkt, onlinePlayer.getSocket());
		});
	}

	private formPktName(data: any, pkt: ServerPacket): any {
		const pktName = pkt.constructor['PKT_CONSTANT_NAME'];
		if (!pktName) {
			return data;
		}
		const newData = {
			pkt_name: pktName,
			...data,
		};
		Object.freeze(newData);
		return newData;
	}
}
