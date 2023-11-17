import { AbstractPacket } from '@/packet/AbstractPacket';
import { Packet } from '@packet/Packet';

@Packet('pkt-player-chat')
export class PlayerChatPacket extends AbstractPacket {
	protected message: string;

	extractPayload(): PlayerChatPacket {
		this.message = this.payload.message;
		return this;
	}
}
