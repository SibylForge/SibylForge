import { AbstractPacket } from '@/application/shared/packet/AbstractPacket';

export abstract class ServerPacket extends AbstractPacket {
	public formHead(): any {
		const data = {
			head: {
				serial: this.serial,
			},
			payload: this.payload,
		};
		Object.freeze(data);

		return data;
	}

	abstract formPayload(): ServerPacket;
}
