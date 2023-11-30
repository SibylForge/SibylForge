import { Packet } from '@/packet/decorator/Packet';
import { OnlinePlayer } from '@/entity/OnlinePlayer';

import { ServerPacket } from '../ServerPacket';

@Packet('net', 'sp-net-login')
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
