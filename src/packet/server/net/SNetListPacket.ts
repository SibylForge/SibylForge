import { join } from 'path';

import { Packet } from '@/application/shared/packet/decorator/Packet';
import { ServerPacket } from '@/application/shared/packet/ServerPacket';

import { OnlinePlayer } from '@/entity/OnlinePlayer';

@Packet('sp-net-list', join(__dirname, SNetListPacket.name))
export class SNetListPacket extends ServerPacket {
	private list: Record<string, OnlinePlayer>;

	constructor(list: Record<string, OnlinePlayer>) {
		super();
		this.list = list;
	}

	public formPayload(): ServerPacket {
		const data = {};
		Object.values(this.list).forEach((value) => {
			data[value.getULID()] = value.getName();
		});
		this.payload = data;
		return this;
	}
}
