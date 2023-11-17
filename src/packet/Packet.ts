export function Packet(pktConstantName: string): ClassDecorator {
	return (target: any) => {
		target.PKT_CONSTANT_NAME = pktConstantName;
	};
}
