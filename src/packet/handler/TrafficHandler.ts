import { Socket } from 'socket.io';

import { AbstractPacket } from '@/packet/AbstractPacket';

export interface TrafficHandler {
	canHandle(pkt: AbstractPacket): boolean;

	handle(packet: AbstractPacket, socket: Socket): void;
}
