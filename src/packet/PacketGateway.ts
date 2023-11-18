import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UUID } from 'crypto';
import { Socket, Server } from 'socket.io';

import { OnlinePlayer } from '@/entity/OnlinePlayer';

import { AbstractPacket } from './AbstractPacket';
import { ClientPacket } from './client/ClientPacket';
import { ServerPacket } from './server/ServerPacket';
import { SPlayerChatPacket } from './server/player/SPlayerChatPacket';
import { CNetLoginPacket } from './client/net/CNetLoginPacket';
import { CNetLogoutPacket } from './client/net/CNetLogoutPacket';

@WebSocketGateway(80, { transports: ['websocket'] })
export class PacketGateway {
	public static onlinePlayers: Record<UUID, OnlinePlayer> = {};

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
		if (isSensitive && !pkt.validate()) {
			// pkt burn out.
			return;
		}
		pkt.extractPayload().freeze();

		if (pkt instanceof CNetLoginPacket) {
			this.initializeOnlinePlayer(pkt, client);
		} else if (pkt instanceof CNetLogoutPacket) {
			this.destroyOnlinePlayer(pkt);
		}
		// process pkt in main loop.

		this.sendPacket(client, new SPlayerChatPacket());
  }

	sendPacket(client: Socket, pkt: ServerPacket) {
		const data = this.formPktName(
			pkt.formPayload().formHead(),
			pkt,
		);
		client.emit('spkt', JSON.stringify(data));
	}

	private initializeOnlinePlayer(pkt: CNetLoginPacket, socket: Socket): void {
		const onlinePlayer = OnlinePlayer.fromPacket(pkt, socket);
		PacketGateway.onlinePlayers[onlinePlayer.getUUID()] = onlinePlayer;
	}

	private destroyOnlinePlayer(pkt: CNetLogoutPacket): void {
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
