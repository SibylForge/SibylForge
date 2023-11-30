import { join } from 'path';

import { Packet } from '@/application/shared/packet/decorator/Packet';

import { CPlayerPacket } from './CPlayerPacket';

@Packet('cp-player-chat', join(__dirname, CPlayerChatPacket.name))
export class CPlayerChatPacket extends CPlayerPacket {
	private message: string;

	public getMessage(): string {
		return this.message;
	}

	extractPayload(): CPlayerChatPacket {
		this.message = this.payload.message;
		return this;
	}
}
