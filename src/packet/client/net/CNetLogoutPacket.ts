import { join } from 'path';

import { Packet } from '@/application/shared/packet/decorator/Packet';

import { CNetPacket } from './CNetPacket';

@Packet('cp-net-logout', join(__dirname, CNetLogoutPacket.name))
export class CNetLogoutPacket extends CNetPacket {
	extractPayload(): CNetLogoutPacket {
		return this;
	}
}
