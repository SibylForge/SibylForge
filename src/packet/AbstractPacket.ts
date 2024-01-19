export abstract class AbstractPacket {
	public static pktMapping: Record<string, any> = {};

	public static readonly PKT_CONSTANT_NAME: string;
	public serial: number;
	public payload: any;

	public static mapClass(name: string, value: any): void {
		this.pktMapping[name] = value;
	}

	public static getClass(name: string): any {
		return this.pktMapping[name];
	}

	public static isSensitive(clazz: any): boolean {
		return Reflect.hasMetadata('IS_SENSITIVE', clazz) && Reflect.getMetadata('IS_SENSITIVE', clazz);
	}

	public freeze(keys?: (keyof AbstractPacket)[]): this {
		if (keys) {
			keys.forEach(key => Object.freeze(this[key]));
		} else {
			Object.freeze(this);
		}
		return this;
	}
}
