import { AbstractPacket } from '@/application/shared/packet/AbstractPacket';
import { ClientPacket } from '@/application/shared/packet/ClientPacket';
import { ServerPacket } from '@/application/shared/packet/ServerPacket';

export function Packet(pktName: string, pkgPath: string): ClassDecorator {
	return (target: any) => {
		target.PKT_CONSTANT_NAME = pktName;

		const isClientPkt = target.prototype instanceof ClientPacket;
		const isServerPkt = target.prototype instanceof ServerPacket;
		if (!isClientPkt && !isServerPkt) {
			throw new Error(`Packet ${pktName} should extends ClientPacket or ServerPacket.`);
		}

		import (pkgPath).then((module) => {
			AbstractPacket.mapClass(pktName, module[target.name]);
		});
	};
}
