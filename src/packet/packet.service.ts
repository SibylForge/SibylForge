import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketId } from 'socket.io-adapter';

import { OnlinePlayer } from '@/entity/OnlinePlayer';

import { ServerPacket } from './server/ServerPacket';

@Injectable()
export class PacketService {
	private connectedSockets: Record<SocketId, OnlinePlayer> = {};

	public sendPacket(pkt: ServerPacket, socket: Socket): void {
		const data = this.formPktName(
			pkt.formPayload().formHead(),
			pkt,
		);
		socket.emit('spkt', JSON.stringify(data));
	}

	public getConnectedSockets(): Record<SocketId, OnlinePlayer> {
		return this.connectedSockets;
	}

	public getOnlinePlayer(socketId: SocketId): OnlinePlayer {
		return this.connectedSockets[socketId];
	}

	public addOnlinePlayer(socketId: SocketId, player: OnlinePlayer): void {
		this.connectedSockets[socketId] = player;
	}

	public removeOnlinePlayer(socketId: string): void {
		delete this.connectedSockets[socketId];
		// Recycle everything from main loop;
	}

	public isConnectedSocket(socketId: SocketId): boolean {
		return this.getOnlinePlayer(socketId) !== undefined;
	}

	public generateIdentity(account: string, socket: Socket): string {
		const { address } = socket.handshake;
		return `${socket.id}.${address}.${account}`;
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
