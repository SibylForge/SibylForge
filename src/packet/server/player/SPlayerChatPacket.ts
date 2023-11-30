import { join } from 'path';

import { Packet } from '@/application/shared/packet/decorator/Packet';
import { ServerPacket } from '@/application/shared/packet/ServerPacket';

@Packet('sp-player-chat', join(__dirname, SPlayerChatPacket.name))
export class SPlayerChatPacket extends ServerPacket {
	private from: string;
	private message: string;

	constructor(from: string, message: string) {
		super();
		this.from = from;
		this.message = message;
	}

	public formPayload() {
		this.payload = {
			from: this.from,
			message: this.message,
		};
		return this;
	}
}
