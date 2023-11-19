import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { PacketService } from './PacketService';
import { AbstractPacket } from './AbstractPacket';
import { ClientPacket } from './client/ClientPacket';
import { CNetLoginPacket } from './client/net/CNetLoginPacket';
import { CNetLogoutPacket } from './client/net/CNetLogoutPacket';
import { CPlayerPacket } from './client/player/CPlayerPacket';
import { TrafficHandler } from './handler/TrafficHandler';
import { NetPacketHandler } from './handler/net/NetPacketHandler';
import { PlayerPacketHandler } from './handler/player/PlayerPacketHandler';

@WebSocketGateway(80, { cors: true })
export class PacketGateway implements OnGatewayDisconnect {
	private handlers: Array<TrafficHandler> = [];

	constructor(
		private readonly packetService: PacketService,
		private readonly netPacketHandler: NetPacketHandler,
		private readonly playerPacketHandler: PlayerPacketHandler,
	) {
		this.handlers = [
			netPacketHandler,
			playerPacketHandler,
		];
	}

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
		let pkt: ClientPacket = new pktClass().extractHead(data)
		if (this.pktShouldQuickAbort(pkt, client) || isSensitive && !pkt.validate()) {
			// pkt burn out.
			return;
		}
		pkt.extractPayload().freeze();

		for (let handler of this.handlers) {
			if (handler.canHandle(pkt)) {
				handler.handle(pkt, client);
				return;
			}
		}
		// Miss process pkts.
  }

	handleDisconnect(client: Socket) {
		this.packetService.removeOnlinePlayer(client.id);
	}

	private pktShouldQuickAbort(pkt: AbstractPacket, socket: Socket): boolean {
		let abortFlag = false;
		const isSocketInList = this.packetService.isConnectedSocket(socket.id);
		if (pkt instanceof CPlayerPacket && !isSocketInList) {
			return true;
		} else if (pkt instanceof CNetLoginPacket && isSocketInList) {
			return true;
		} else if (pkt instanceof CNetLogoutPacket && !isSocketInList) {
			return true;
		}
		return abortFlag;
	}

	private extractPktName(data: any): string | null {
		let pktName: string = data['pkt_name'];
		if (!pktName || pktName === '') {
			return null;
		}
		return pktName;
	}
}
