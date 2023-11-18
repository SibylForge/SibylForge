import { UUID, randomUUID } from 'crypto';
import { Socket } from 'socket.io';

export class OnlinePlayer {
	protected id: UUID;
	protected identity: string;
	protected name: string;
	protected socket: Socket;

	constructor(identity: string, name: string, socket: Socket) {
		this.id = randomUUID()
		this.identity = identity;
		this.name = name;
		this.socket = socket;
	}

	public getUUID(): UUID {
		return this.id;
	}

	public getName(): string {
		return this.name;
	}

	public getSocket(): Socket {
		return this.socket;
	}

	public isConnected(): boolean {
		return this.socket.connected;
	}
}
