import { Packet } from '@packet/decorator/Packet';
import { CPlayerPacket } from '@packet/client/player/CPlayerPacket';

@Packet('cp-player-chat')
export class CPlayerChatPacket extends CPlayerPacket {
	protected message: string;

	extractPayload(): CPlayerChatPacket {
		this.message = this.payload.message;
		console.log(this.message);
		return this;
	}
}
