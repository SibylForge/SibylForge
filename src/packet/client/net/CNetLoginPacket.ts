import { Packet } from '@/packet/decorator/Packet';

import { CNetPacket } from './CNetPacket';

@Packet('net', 'cp-net-login')
export class CNetLoginPacket extends CNetPacket {
	private token: string;

	constructor(token: string) {
		super();
		this.token = token;
	}

	public getToken(): string {
		return this.token;
	}

	public extractPayload(): this {
		this.token = this.payload['token'];

		return this;
	}
}
