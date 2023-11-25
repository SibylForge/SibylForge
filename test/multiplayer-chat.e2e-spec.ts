import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { io } from 'socket.io-client';
import { expect } from 'chai';

import { SocketClient } from './socket-client';
import { Config } from '@/config';
import { SocketIoAdapter } from '@/packet/SocketIoAdapter';
import { AuthModule } from '@/auth/auth.module';
import { PacketModule } from '@/packet/packet.module';

describe('Multiplayer Chat Test', () => {
  let app: INestApplication;
	let configService: ConfigService<Config>;

  beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ envFilePath: '.e2e.test.env' }),
				PacketModule,
				AuthModule
			],
		}).compile();

    app = moduleFixture.createNestApplication();
		configService = app.get(ConfigService);
		app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Should allow multiple players to chat', async () => {
    const numPlayers = 3;
    const socketClients: Array<SocketClient> = [];

		for (let i = 0; i < numPlayers; i++) {
			const socket = io(`ws://127.0.0.1:${configService.get('WEBSOCKET_PORT')}`, {
				reconnection: false,
				forceNew: true,
			});
			const socketClient = new SocketClient(socket);
			const { body } = await socketClient.loginHttp(app, { account: `account_${i}`, name: `player {i}` });
			const { token } = body;

			socket.on('connect', () => {
				socketClient.login(token);
			});
			socketClients.push(socketClient);
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
		socketClients.forEach((each) => each.chat(`I'm ${each.name}`));
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Check lsit
		const nameList = socketClients.map((each) => each.name);
		socketClients.forEach((each) => {
			expect(Object.values(each.list)).deep.equals(nameList);
		});

		// Check chat
		const chatList = socketClients.map((each) => `I'm ${each.name}`);
		socketClients.forEach((each) => {
			expect(Object.values(each.readPackets)).deep.equals(chatList);
		});

		socketClients.forEach((each) => each.logout());

		socketClients.forEach((each) => each.disconnect());
  });
});
