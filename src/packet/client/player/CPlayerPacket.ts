import { OnlinePlayer } from '@entity/OnlinePlayer';
import { ClientPacket } from '@packet/client/ClientPacket';
import { PacketGateway } from '@packet/PacketGateway';

export abstract class CPlayerPacket extends ClientPacket {
	protected identity: string;
	protected onlinePlayer: OnlinePlayer;

	public extractHead(data: any): ClientPacket {
		super.extractHead(data);

		this.identity = data['identity'] || '';
		this.markOnlinePlayer();
		return this;
	}

	public validate(): boolean {
		return this.onlinePlayer !== undefined;
	}

	public getIdentity(): string {
		return this.identity;
	}

	private markOnlinePlayer(): void {
		const onlinePlayer = PacketGateway.onlinePlayers[this.identity];
		if (onlinePlayer) {
			this.onlinePlayer = onlinePlayer;
		}
	}
}
