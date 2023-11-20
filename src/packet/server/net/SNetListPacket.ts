import { Packet } from '@/packet/decorator/Packet';
import { OnlinePlayer } from '@/entity/OnlinePlayer';

import { ServerPacket } from '../ServerPacket';

@Packet('net', 'sp-net-list')
export class SNetListPacket extends ServerPacket {
	private list: Record<string, OnlinePlayer>;

	constructor(list: Record<string, OnlinePlayer>) {
		super();
		this.list = list;
	}

	public formPayload(): ServerPacket {
		const data = {};
		Object.values(this.list).forEach((value) => {
			data[value.getUUID()] = value.getName();
		});
		this.payload = data;
		return this;
	}
}
