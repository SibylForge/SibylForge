import { ClientPacket } from '@/packet/client/ClientPacket';
import { Packet } from '@/packet/decorator/Packet';

@Packet('cp-player-login')
export class CPlayerLoginPacket extends ClientPacket {
	extractPayload(): CPlayerLoginPacket {
		return this;
	}
}
