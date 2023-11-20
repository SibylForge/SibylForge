import { AbstractPacket } from '@/packet/AbstractPacket';

export abstract class ClientPacket extends AbstractPacket {
	protected identity: string;

	public validate(): boolean {
		return true;
	}

	public extractHead(data: any): ClientPacket {
		this.serial = data['head']['serial'];
		this.identity = data['identity'];
		this.payload = data['payload'];

		Object.freeze(this.identity);
		return this.freeze(['serial', 'payload']) as ClientPacket;
	}

	abstract extractPayload(): ClientPacket;
}
