import { CNetLoginPacket } from '@/packet/client/net/CNetLoginPacket';
import { CNetLogoutPacket } from '@/packet/client/net/CNetLogoutPacket';
import { CPlayerChatPacket } from '@/packet/client/player/CPlayerChatPacket';
import { SNetListPacket } from '@/packet/server/net/SNetListPacket';
import { SNetLoginPacket } from '@/packet/server/net/SNetLoginPacket';
import { SPlayerChatPacket } from '@/packet/server/player/SPlayerChatPacket';

export class SocketClient {
	public readPackets: Array<any> = [];
	public list: any;
	public uuid: string;
	public identity: string;

	constructor(
		public readonly name: string,
		public readonly socket: any,
	) {
		socket.on('spkt', this.onSPacket.bind(this));
	}

	onSPacket(packet: any): void {;
		const data = JSON.parse(packet) as any;
		switch (data.pkt_name) {
			case SNetLoginPacket.PKT_CONSTANT_NAME:
				this.identity = data.payload.identity;
				break;
			case SNetListPacket.PKT_CONSTANT_NAME:
				this.list = data.payload;
				break;
			case SPlayerChatPacket.PKT_CONSTANT_NAME:
				this.readPackets.push(data.payload.message);
				break;
		}
	}

	login() {
		const data = JSON.stringify({
			pkt_name: CNetLoginPacket.PKT_CONSTANT_NAME,
			head: { serial: 1},
			payload: {
				name: this.name,
				account: this.name,
			},
		});
		this.socket.emit('pkt-net', data);
	}

	logout() {
		const data = JSON.stringify({
			pkt_name: CNetLogoutPacket.PKT_CONSTANT_NAME,
			identity: this.identity,
			head: { serial: 1 },
			payload: {},
		});
		this.socket.emit('pkt-net', data);
	}

	chat(message: string) {
		const data = JSON.stringify({
			pkt_name: CPlayerChatPacket.PKT_CONSTANT_NAME,
			identity: this.identity,
			head: { serial: 1 },
			payload: { message },
		});
		this.socket.emit('pkt-player', data);
	}

	disconnect() {
		this.socket.disconnect();
	}
}
