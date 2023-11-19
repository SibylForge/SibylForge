import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
	constructor(
		private app: INestApplicationContext,
		private configService: ConfigService<{
			WEBSOCKET_PORT: number;
		}>,
	) {
		super(app);
	}

	createIOServer(port: number, options?: any) {
		const configPort = this.configService.get('WEBSOCKET_PORT');

		return super.createIOServer(configPort, options);
	}
}
