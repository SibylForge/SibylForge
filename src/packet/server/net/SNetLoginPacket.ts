import { join } from 'path';

import { Packet } from '@/application/shared/packet/decorator/Packet';
import { ServerPacket } from '@/application/shared/packet/ServerPacket';

import { OnlinePlayer } from '@/entity/OnlinePlayer';

@Packet('sp-net-login', join(__dirname, SNetLoginPacket.name))
export class SNetLoginPacket extends ServerPacket {
	private isSuccess = true;
	private identity = ''
	private id = '';
	private name = '';

	constructor(isSuccess: boolean, onlinePlayer: OnlinePlayer) {
		super();
		this.isSuccess = isSuccess;
		this.identity = onlinePlayer.getIdentity();
		this.id = onlinePlayer.getULID();
		this.name = onlinePlayer.getName();
	}

	public formPayload(): ServerPacket {
		this.payload = {
			is_success: this.isSuccess,
			identity: this.identity,
			id: this.id,
			name: this.name,
		};
		return this;
	}
}
