import { ClientPacket } from '@packet/client/ClientPacket';
import { Packet } from '@/packet/decorator/Packet';

@Packet('pkt-player-logout')
export class PlayerLogoutPacket extends ClientPacket {
	extractPayload(): PlayerLogoutPacket {
		return this;
	}
}
