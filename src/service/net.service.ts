import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class NetService {
	public generateIdentity(account: string, socket: Socket): string {
		const { address } = socket.handshake;
		return `${socket.id}.${address}.${account}`;
	}
}
