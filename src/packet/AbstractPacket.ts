export abstract class AbstractPacket {
	public static readonly PKT_CONSTANT_NAME: string;
	public serial: number;
	public payload: any;

	extractHead(data: any): AbstractPacket {
		this.serial = data['head']['serial'];
		this.payload = data['payload'];

		return this.freeze(['serial', 'payload']);
	}

	abstract extractPayload(): AbstractPacket;

	public freeze(keys?: (keyof AbstractPacket)[]): AbstractPacket {
		if (keys) {
			keys.forEach(key => Object.freeze(this[key]));
		} else {
			Object.freeze(this);
		}
		return this;
	}
}
