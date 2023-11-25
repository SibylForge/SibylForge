import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { io } from 'socket.io-client';
import { expect } from 'chai';

import { SocketClient } from './socket-client';
import { Config } from '@/config';
import { AppModule } from '@/app.module';
import { SocketIoAdapter } from '@/packet/SocketIoAdapter';
import { PacketService } from '@/packet/packet.service';

describe('Multiplayer Connect Test', () => {
	let app: INestApplication;
	let configService: ConfigService<Config>;
	let packetService: PacketService;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		configService = app.get(ConfigService);
		packetService = app.get(PacketService);
		app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it('Should allow multiple players connect', async () => {
		const numPlayers = 3;
		const socketClients: Array<SocketClient> = [];

		for (let i = 0; i < numPlayers; i++) {
			const socket = io(`ws://127.0.0.1:${configService.get('WEBSOCKET_PORT')}`, {
				reconnection: false,
				forceNew: true,
			});
			const socketClient = new SocketClient(socket);
			const { body } = await socketClient.loginHttp(app, { account: `account ${i}`, name: `player {i}` });
			const { token } = body;

			socket.on('connect', () => {
				socketClient.login(token);
			});
			socketClients.push(socketClient);
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Check lsit
		let nameList = socketClients.map((each) => each.name);
		socketClients.forEach((each) => {
			expect(Object.values(each.list)).deep.equals(nameList);
		});

		const logoutClient = socketClients.pop();
		logoutClient.logout();

		await new Promise((resolve) => setTimeout(resolve, 1000));

		nameList = socketClients.map((each) => each.name)
		socketClients.forEach((each) => {
			expect(Object.values(each.list)).deep.equals(nameList);
		});

		const serverConnectedSockets = packetService.getConnectedSockets();
		const connectedSocketIds = Object.values(socketClients).map((each) => each.socket.id);
		expect(Object.keys(serverConnectedSockets)).not.includes(logoutClient.socket.id);
		expect(Object.keys(serverConnectedSockets)).deep.equals(connectedSocketIds);
	});
});
