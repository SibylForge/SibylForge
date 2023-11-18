import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { AbstractPacket } from './AbstractPacket';
import { ClientPacket } from './client/ClientPacket';
import { ServerPacket } from './server/ServerPacket';
import { SPlayerChatPacket } from './server/player/SPlayerChatPacket';

@WebSocketGateway(80, { transports: ['websocket'] })
export class PacketGateway {
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
		this.sendPacket(client, new SPlayerChatPacket());
  }

	sendPacket(client: Socket, pkt: ServerPacket) {
		const data = this.formPktName(
			pkt.formPayload().formHead(),
			pkt,
		);
		client.emit('spkt', JSON.stringify(data));
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
