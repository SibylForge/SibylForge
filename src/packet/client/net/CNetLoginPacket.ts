import { ClientPacket } from '@packet/client/ClientPacket';
import { Packet } from '@packet/decorator/Packet';

@Packet('cp-net-login')
export class CNetLoginPacket extends ClientPacket {
	extractPayload(): CNetLoginPacket {
		return this;
	}
}
