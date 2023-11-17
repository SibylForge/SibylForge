import { AbstractSensitivePacket } from '@packet/AbstractSensitivePacket';
import { Packet } from '@packet/Packet';

@Packet('pkt-player-logout')
export class PlayerLogoutPacket extends AbstractSensitivePacket {
	extractPayload(): PlayerLogoutPacket {
		return this;
	}
}
