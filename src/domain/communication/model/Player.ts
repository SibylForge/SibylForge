import { ValueObject } from '@/domain/shared/ValueObject';

import { ULID } from './ULID';

interface PlayerProps {
	id: ULID;
}

export class Player extends ValueObject<PlayerProps> {
	getId(): string {
		return this.props.id.toValue();
	}
}
