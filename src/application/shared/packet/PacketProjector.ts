export interface PacketProjector {
	send(pkt: any, targetId: string): void;

	sendAll(pkt: any): void;
}
