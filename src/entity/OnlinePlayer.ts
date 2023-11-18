import { UUID, randomUUID } from 'crypto';
import { Socket } from 'socket.io';

import { CNetLoginPacket } from '@packet/client/net/CNetLoginPacket';

export class OnlinePlayer {
	protected id: UUID;
	protected socket: Socket;

	constructor(socket: Socket) {
		this.id = randomUUID()
		this.socket = socket;
	}

	public static fromPacket(pkt: CNetLoginPacket, socket: Socket): OnlinePlayer {
		return new OnlinePlayer(socket);
	}

	public getUUID(): UUID {
		return this.id;
	}

	public isConnected(): boolean {
		return this.socket.connected;
	}
}
