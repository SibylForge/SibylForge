import { AbstractPacket } from '@packet/AbstractPacket';

export abstract class ClientPacket extends AbstractPacket {
	public validate(): boolean {
		return true;
	}

	public extractHead(data: any): ClientPacket {
		this.serial = data['head']['serial'];
		this.payload = data['payload'];

		return this.freeze(['serial', 'payload']) as ClientPacket;
	}

	abstract extractPayload(): ClientPacket;
}
