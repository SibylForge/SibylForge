import { Packet } from '@/packet/decorator/Packet';
import { ServerPacket } from '@packet/server/ServerPacket';

@Packet('sp-player-chat')
export class SPlayerChatPacket extends ServerPacket {
	message: string = '';

	formPayload() {
		this.payload = {
			message: this.message,
		};
		return this;
	}
}
