import { Packet } from '@packet/decorator/Packet';
import { CPlayerPacket } from '@packet/client/player/CPlayerPacket';

@Packet('player', 'cp-player-chat')
export class CPlayerChatPacket extends CPlayerPacket {
	private message: string;

	public getMessage(): string {
		return this.message;
	}

	extractPayload(): CPlayerChatPacket {
		this.message = this.payload.message;
		return this;
	}
}
