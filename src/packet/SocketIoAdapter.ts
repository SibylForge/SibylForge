import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { Config } from '@/config';

export class SocketIoAdapter extends IoAdapter {
	constructor(
		private app: INestApplicationContext,
		private configService: ConfigService<Config>,
	) {
		super(app);
	}

	createIOServer(port: number, options?: any) {
		const configPort = this.configService.get('WEBSOCKET_PORT');

		return super.createIOServer(configPort, options);
	}
}
