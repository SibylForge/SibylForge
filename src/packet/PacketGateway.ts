import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Socket, Server } from 'socket.io';

import { OnlinePlayer } from '@/entity/OnlinePlayer';

import { AbstractPacket } from './AbstractPacket';
import { ClientPacket } from './client/ClientPacket';
import { ServerPacket } from './server/ServerPacket';
import { SPlayerChatPacket } from './server/player/SPlayerChatPacket';
import { CNetLoginPacket } from './client/net/CNetLoginPacket';
import { CNetLogoutPacket } from './client/net/CNetLogoutPacket';
import { CPlayerPacket } from './client/player/CPlayerPacket';
import { CPlayerChatPacket } from './client/player/CPlayerChatPacket';
import { SNetLoginPacket } from './server/net/SNetLoginPacket';
import { SNetListPacket } from './server/net/SNetListPacket';

@WebSocketGateway(80, { cors: true })
export class PacketGateway {
	protected static connectedSockets: Record<string, OnlinePlayer> = {};

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('pkt')
  onPackets(@MessageBody() rawData: any, @ConnectedSocket() client: Socket) {
		const data = JSON.parse(rawData);
		Object.freeze(data);

		const pktName = this.extractPktName(data);
		const pktClass = AbstractPacket.getClass(pktName);
		if (!pktClass) { return; }

		const isSensitive = AbstractPacket.isSensitive(pktClass);
		let pkt: ClientPacket = new pktClass().extractHead(data);
		if (this.pktShouldQuickAbort(pkt, client) || isSensitive && !pkt.validate()) {
			// pkt burn out.
			return;
		}
		pkt.extractPayload().freeze();

		if (pkt instanceof CNetLoginPacket) {
			this.initializeOnlinePlayer(pkt, client);
		} else if (pkt instanceof CNetLogoutPacket) {
			this.destroyOnlinePlayer(pkt, client);
		} else if (pkt instanceof CPlayerPacket) {
			if (pkt instanceof CPlayerChatPacket) {
				const fromOnlinePlayer = PacketGateway.connectedSockets[client.id];
				const fromUUID = fromOnlinePlayer.getUUID();
				const message = pkt.getMessage();
				const resPkt = new SPlayerChatPacket(fromUUID, message);
				this.broadcast(resPkt);
			}
		}
		// process pkt in main loop.

  }

	sendPacket(pkt: ServerPacket, socket: Socket) {
		const data = this.formPktName(
			pkt.formPayload().formHead(),
			pkt,
		);
		socket.emit('spkt', JSON.stringify(data));
	}

	private pktShouldQuickAbort(pkt: AbstractPacket, socket: Socket): boolean {
		let abortFlag = false;
		const isSocketInList = PacketGateway.connectedSockets[socket.id];
		if (pkt instanceof CPlayerPacket && !isSocketInList) {
			return true;
		} else if (pkt instanceof CNetLoginPacket && isSocketInList) {
			return true;
		} else if (pkt instanceof CNetLogoutPacket && !isSocketInList) {
			return true;
		}
		return abortFlag;
	}

	private broadcast(pkt: ServerPacket): void {
		Object.values(PacketGateway.connectedSockets).forEach((onlinePlayer) => {
			this.sendPacket(pkt, onlinePlayer.getSocket());
		});
	}

	private generateIdentity(account: string, socket: Socket): string {
		const { address } = socket.handshake;
		return `${socket.id}.${address}.${account}`;
	}

	private initializeOnlinePlayer(pkt: CNetLoginPacket, socket: Socket): void {
		const identity = this.generateIdentity(pkt.getAccount(), socket);;
		const onlinePlayer = new OnlinePlayer(identity, pkt.getName(), socket);
		PacketGateway.connectedSockets[socket.id] = onlinePlayer;

		const resPkt = new SNetLoginPacket(true, randomUUID(), identity);
		this.sendPacket(resPkt, socket);

		const listPkt = new SNetListPacket(PacketGateway.connectedSockets);
		this.broadcast(listPkt);
	}

	private destroyOnlinePlayer(pkt: CNetLogoutPacket, socket: Socket): void {
	}

	private extractPktName(data: any): string | null {
		let pktName: string = data['pkt_name'];
		if (!pktName || pktName === '') {
			return null;
		}
		return pktName;
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
