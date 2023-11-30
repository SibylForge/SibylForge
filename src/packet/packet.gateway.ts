import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { AbstractPacket } from '@/application/shared/packet/AbstractPacket';
import { ClientPacket } from '@/application/shared/packet/ClientPacket';

import { PacketService } from './packet.service';
import { CNetPacket } from './client/net/CNetPacket';
import { CNetLoginPacket } from './client/net/CNetLoginPacket';
import { CNetLogoutPacket } from './client/net/CNetLogoutPacket';
import { CPlayerPacket } from './client/player/CPlayerPacket';
import { NetPacketHandler } from './handler/net/NetPacketHandler';
import { PlayerPacketHandler } from './handler/player/PlayerPacketHandler';

@WebSocketGateway({ cors: true })
export class PacketGateway implements OnGatewayDisconnect {
	constructor(
		private readonly packetService: PacketService,
		private readonly netPacketHandler: NetPacketHandler,
		private readonly playerPacketHandler: PlayerPacketHandler,
	) {}

  @WebSocketServer()
  server: Server;

  onPackets<T>(rawData: any, client: Socket): T | null {
		const data = JSON.parse(rawData);
		Object.freeze(data);

		const pktName = this.extractPktName(data);
		const pktClass = AbstractPacket.getClass(pktName);
		if (!pktClass) { return; }

		const isSensitive = AbstractPacket.isSensitive(pktClass);
		let pkt: ClientPacket = new pktClass().extractHead(data)
		if (this.pktShouldQuickAbort(pkt, client) || isSensitive && !pkt.validate()) {
			// pkt burn out.
			return null;
		}
		return pkt.extractPayload().freeze() as T;
  }

	@SubscribeMessage('pkt-net')
	onNetPackets(@MessageBody() rawData: any, @ConnectedSocket() client: Socket) {
		const pkt: CNetPacket = this.onPackets<CNetPacket>(rawData, client);
		const canHandle = this.netPacketHandler.canHandle(pkt);
		if (!pkt || !canHandle) {
			return;
		}

		this.netPacketHandler.handle(pkt, client);
	}

	@SubscribeMessage('pkt-player')
	onPlayerPackets(@MessageBody() rawData: any, @ConnectedSocket() client: Socket) {
		const pkt: CPlayerPacket = this.onPackets<CPlayerPacket>(rawData, client);
		const canHandle = this.playerPacketHandler.canHandle(pkt);
		if (!pkt || !canHandle) {
			return;
		}

		this.playerPacketHandler.handle(pkt, client);
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
