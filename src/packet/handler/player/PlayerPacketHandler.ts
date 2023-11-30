import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { AbstractPacket } from '@/packet/AbstractPacket';
import { CPlayerPacket } from '@/packet/client/player/CPlayerPacket';
import { TrafficHandler } from '@/packet/handler/TrafficHandler';

import { Chat } from '@/application/communication/Chat';

@Injectable()
export class PlayerPacketHandler implements TrafficHandler {
	private handlers: Array<TrafficHandler> = [];

	constructor(
		private readonly chat: Chat,
	) {
		this.handlers = [
			chat,
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
