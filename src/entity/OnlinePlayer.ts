import { ULID, ulid } from 'ulidx';
import { Socket } from 'socket.io';

export class OnlinePlayer {
	protected id: ULID;
	protected identity: string;
	protected name: string;
	protected socket: Socket;

	constructor(identity: string, name: string, socket: Socket) {
		this.id = ulid()
		this.identity = identity;
		this.name = name;
		this.socket = socket;
	}

	public getULID(): ULID {
		return this.id;
	}

	public getIdentity(): string {
		return this.identity;
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
