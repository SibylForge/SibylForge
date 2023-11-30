import { isValid } from 'ulidx';

import { EntityId } from '@/domain/EntityId';

export class ULID extends EntityId<string> {
	constructor(id: string) {
		super(id);

		if (!isValid(id)) {
			throw new Error('Invalid ULID');
		}
	}
}
