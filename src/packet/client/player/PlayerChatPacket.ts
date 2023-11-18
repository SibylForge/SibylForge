import { ClientPacket } from '@/packet/client/ClientPacket';
import { Packet } from '@/packet/decorator/Packet';

@Packet('pkt-player-chat')
export class PlayerChatPacket extends ClientPacket {
	protected message: string;

	extractPayload(): PlayerChatPacket {
		this.message = this.payload.message;
		console.log(this.message);
		return this;
	}
}
