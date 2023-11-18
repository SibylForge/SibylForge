import { OnlinePlayer } from '@/entity/OnlinePlayer';
import { Packet } from '@packet/decorator/Packet';
import { ServerPacket } from '@packet/server/ServerPacket';

@Packet('player', 'sp-player-chat')
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
