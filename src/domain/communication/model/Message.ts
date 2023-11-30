import { AggregateRoot } from '@/domain/shared/AggregateRoot';

import { Player } from './Player';
import { ULID } from './ULID';

import { Chatted } from '../event/Chatted';

type MessageType = 'chat';
type Messager = Player;

interface MessageProps {
	type: MessageType;
	to: Messager;
	from: Messager;
	content: string;
}

export class Message extends AggregateRoot<ULID, MessageProps> {
	static createMessage(params: {
		id: ULID,
		type: MessageType,
		to: Messager,
		from: Messager,
		content: string,
	}): [string, Message] {
		return [undefined, new Message(params.id, {
			type: params.type,
			to: params.to,
			from: params.from,
			content: params.content,
		})];
	}

	chat(): void {
		this.addDomainEvent(new Chatted(this));
	}

	getFrom(): Messager {
		return this.props.from;
	}

	getContent(): string {
		return this.props.content;
	}
}
