import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { AbstractPacket } from '@/packet/AbstractPacket';
import { TrafficHandler } from '@/packet/handler/TrafficHandler';
import { CNetPacket } from '@/packet/client/net/CNetPacket';

import { LoginPacketHandler } from './LoginPacketHandler';
import { LogoutPacketHandler } from './LogoutPacketHandler';

@Injectable()
export class NetPacketHandler implements TrafficHandler {
	private handlers: Array<TrafficHandler> = [];

	constructor(
		private readonly loginPacketHandler: LoginPacketHandler,
		private readonly logoutPacketHandler: LogoutPacketHandler,
	) {
		this.handlers = [
			loginPacketHandler,
			logoutPacketHandler,
		];
	}

	canHandle(pkt: AbstractPacket): boolean {
		return pkt instanceof CNetPacket;
	}

	handle(pkt: AbstractPacket, socket: Socket): void {
		for (let handler of this.handlers) {
			if (handler.canHandle(pkt)) {
				handler.handle(pkt, socket);
				return;
			}
		}
	}
}
