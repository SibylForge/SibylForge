import { ClientPacket } from '@packet/client/ClientPacket';
import { Packet } from '@packet/decorator/Packet';

@Packet('cp-net-logout')
export class CNetLogoutPacket extends ClientPacket {
	extractPayload(): CNetLogoutPacket {
		return this;
	}
}
