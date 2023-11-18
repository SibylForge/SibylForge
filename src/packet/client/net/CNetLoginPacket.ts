import { ClientPacket } from '@packet/client/ClientPacket';
import { Packet } from '@packet/decorator/Packet';

@Packet('net', 'cp-net-login')
export class CNetLoginPacket extends ClientPacket {
	private account: string;
	private name: string;

	constructor(account: string, name: string) {
		super();
		this.account = account;
		this.name = name;
	}

	public getAccount(): string {
		return this.account;
	}

	public getName(): string {
		return this.name;
	}

	public extractPayload(): CNetLoginPacket {
		this.account = this.payload['account'];
		this.name = this.payload['name'];

		return this;
	}
}
