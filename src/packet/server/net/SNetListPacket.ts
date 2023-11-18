import { Packet } from "@/packet/decorator/Packet";
import { ServerPacket } from "../ServerPacket";
import { OnlinePlayer } from "@/entity/OnlinePlayer";

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
