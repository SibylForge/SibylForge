import { Packet } from '@/packet/decorator/Packet';

import { ServerPacket } from '../ServerPacket';

@Packet('net', 'sp-net-login')
export class SNetLoginPacket extends ServerPacket {
	private isSuccess = true;
	private uuid = '';
	private identity = '';

	constructor(isSuccess: boolean, uuid: string, identity: string) {
		super();
		this.isSuccess = isSuccess;
		this.uuid = uuid;
		this.identity = identity;
	}

	public formPayload(): ServerPacket {
		this.payload = {
			is_success: this.isSuccess,
			uuid: this.uuid,
			identity: this.identity,
		};
		return this;
	}
}
