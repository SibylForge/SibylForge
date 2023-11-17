import { AbstractPacket } from './AbstractPacket';

export abstract class AbstractSensitivePacket extends AbstractPacket {
	abstract extractPayload(): AbstractPacket;

	public validate(): boolean {
		return false;
	}
}
