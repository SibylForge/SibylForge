import { join } from 'path';

import { Packet } from '@/application/shared/packet/decorator/Packet';

import { CNetPacket } from './CNetPacket';

@Packet('cp-net-login', join(__dirname, CNetLoginPacket.name))
export class CNetLoginPacket extends CNetPacket {
	private token: string;

	constructor(token: string) {
		super();
		this.token = token;
	}

	public getToken(): string {
		return this.token;
	}

	public extractPayload(): CNetLoginPacket {
		this.token = this.payload['token'];

		return this;
	}
}
