import { ClientPacket } from '@/packet/client/ClientPacket';
import { Packet } from '@/packet/decorator/Packet';

@Packet('cp-player-chat')
export class CPlayerChatPacket extends ClientPacket {
	protected message: string;

	extractPayload(): CPlayerChatPacket {
		this.message = this.payload.message;
		console.log(this.message);
		return this;
	}
}
