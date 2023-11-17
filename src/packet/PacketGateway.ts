import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { AbstractPacket } from './AbstractPacket';
import { AbstractSensitivePacket } from './AbstractSensitivePacket';

import { PlayerLoginPacket } from './player/PlayerLoginPacket';
import { PlayerLogoutPacket } from './player/PlayerLogoutPacket';
import { PlayerChatPacket } from './player/PlayerChatPacket';

@WebSocketGateway(80, { transports: ['websocket'] })
export class PacketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('pkt')
  onPackets(@MessageBody() rawData: any, @ConnectedSocket() client: Socket) {
		const data = JSON.parse(rawData);
		Object.freeze(data);
		let pkt: AbstractPacket = this.extractPktHead(data);
		if (!pkt) { return; }

		if (pkt instanceof AbstractSensitivePacket && !(pkt as AbstractSensitivePacket).validate()) {
			// pkt burn out.
			return;
		}
		pkt.extractPayload().freeze();
  }

	private extractPktHead(data: any): AbstractPacket {
		try {
			let pktName: string = data['pkt_name'];
			if (!pktName || pktName === '') { return; }

			switch (pktName) {
				case PlayerLoginPacket.PKT_CONSTANT_NAME:
					return new PlayerLoginPacket().extractHead(data);
				case PlayerLogoutPacket.PKT_CONSTANT_NAME:
					return new PlayerLogoutPacket().extractHead(data);
				case PlayerChatPacket.PKT_CONSTANT_NAME:
					return new PlayerChatPacket().extractHead(data);
				default:
					return null;
			}
		} catch {
			return null;
		}
	}
}
