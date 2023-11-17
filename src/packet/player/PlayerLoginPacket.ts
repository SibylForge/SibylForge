import { AbstractSensitivePacket } from '@/packet/AbstractSensitivePacket';
import { Packet } from '@packet/Packet';

@Packet('pkt-player-login')
export class PlayerLoginPacket extends AbstractSensitivePacket {
	extractPayload(): PlayerLoginPacket {
		return this;
	}
}
