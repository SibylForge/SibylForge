import { join } from 'path';
import { AbstractPacket } from '@packet/AbstractPacket';
import { ClientPacket } from '@packet/client/ClientPacket';
import { ServerPacket } from '@packet/server/ServerPacket';

export function Packet(namepsace: string, pktName: string): ClassDecorator {
	return (target: any) => {
		target.PKT_CONSTANT_NAME = pktName;

		const isClientPkt = target.prototype instanceof ClientPacket;
		const isServerPkt = target.prototype instanceof ServerPacket;
		if (!isClientPkt && !isServerPkt) {
			throw new Error(`Packet ${pktName} should extends ClientPacket or ServerPacket.`);
		}

		const pkgPath = join(__dirname, '..', isClientPkt ? 'client' : 'server', namepsace, target.name)
		import (pkgPath).then((module) => {
			AbstractPacket.mapClass(pktName, module[target.name]);
		});
	};
}
