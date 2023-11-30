import { Injectable } from '@nestjs/common';
import { ULID } from 'ulidx';
import { Socket } from 'socket.io';
import { SocketId } from 'socket.io-adapter';

import { PacketProjector } from '@/application/shared/packet/PacketProjector';

import { OnlinePlayer } from '@/entity/OnlinePlayer';

import { ServerPacket } from './server/ServerPacket';

@Injectable()
export class PacketService implements PacketProjector {
	private connectedSockets: Record<SocketId, OnlinePlayer> = {};
	private onlinePlayers: Record<ULID, OnlinePlayer> = {};

	send(pkt: object, targetId: string): void {
		const player = this.getOnlinePlayerByUlid(targetId);
		this.sendPacket(pkt as ServerPacket, player.getSocket());
	}

	sendAll(pkt: object): void {
		this.broadcast(pkt as ServerPacket);
	}

	public sendPacket(pkt: ServerPacket | object, socket: Socket): void {
		const data = pkt instanceof ServerPacket ? this.formPktName(
			pkt.formPayload().formHead(),
			pkt,
		) : pkt;
		socket.emit('spkt', JSON.stringify(data));
	}

	public getConnectedSockets(): Record<SocketId, OnlinePlayer> {
		return this.connectedSockets;
	}

	public getOnlinePlayer(socketId: SocketId): OnlinePlayer {
		return this.connectedSockets[socketId];
	}

	public getOnlinePlayerByUlid(ulid: string): OnlinePlayer {
		return this.onlinePlayers[ulid];
	}

	public addOnlinePlayer(socketId: SocketId, player: OnlinePlayer): void {
		this.connectedSockets[socketId] = player;
		this.onlinePlayers[player.getULID()] = player;
	}

	public removeOnlinePlayer(socketId: string): void {
		const player = this.connectedSockets[socketId];

		if (player !== undefined) {
			delete this.onlinePlayers[player.getULID()];
			delete this.connectedSockets[socketId];
		}
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
