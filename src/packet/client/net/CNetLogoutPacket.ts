import { Packet } from '@/packet/decorator/Packet';

import { CNetPacket } from './CNetPacket';

@Packet('net', 'cp-net-logout')
export class CNetLogoutPacket extends CNetPacket {
	extractPayload(): this {
		return this;
	}
}
