import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { TrafficHandler } from '@/application/shared/packet/TrafficHandler';

import { AbstractPacket } from '@/packet/AbstractPacket';
import { CPlayerPacket } from '@/packet/client/player/CPlayerPacket';

import { ChatPacketHandler } from './ChatPacketHandler';

@Injectable()
export class PlayerPacketHandler implements TrafficHandler {
	private handlers: Array<TrafficHandler> = [];

	constructor(
		private readonly chatPacketHandler: ChatPacketHandler,
	) {
		this.handlers = [
			chatPacketHandler,
		];
	}

	canHandle(pkt: AbstractPacket): boolean {
		return pkt instanceof CPlayerPacket;
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
