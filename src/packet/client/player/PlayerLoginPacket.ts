import { ClientPacket } from '@/packet/client/ClientPacket';
import { Packet } from '@/packet/decorator/Packet';

@Packet('pkt-player-login')
export class PlayerLoginPacket extends ClientPacket {
	extractPayload(): PlayerLoginPacket {
		return this;
	}
}
