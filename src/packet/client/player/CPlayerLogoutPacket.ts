import { ClientPacket } from '@packet/client/ClientPacket';
import { Packet } from '@/packet/decorator/Packet';

@Packet('cp-player-logout')
export class CPlayerLogoutPacket extends ClientPacket {
	extractPayload(): CPlayerLogoutPacket {
		return this;
	}
}
