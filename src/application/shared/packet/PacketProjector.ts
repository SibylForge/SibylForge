export interface PacketProjector {
	send(pkt: object, targetId: string): void;

	sendAll(pkt: object): void;
}
