import { Message } from '../model/Message';

export class Mapper {
	public toServerPacket(message: Message): object {
		return {
			pkt_name: 'sp-player-chat',
			payload: {
				from: message.getFrom().getId(),
				message: message.getContent(),
			},
		};
	}
}
