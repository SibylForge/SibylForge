import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io } from 'socket.io-client';
import { expect } from 'chai';

import { PacketModule } from '@/packet/PacketModule';

import { SocketClient } from './socket-client';

describe('Multiplayer Chat Test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [PacketModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Should allow multiple players to chat', async () => {
    const numPlayers = 3;
    const socketClients: Array<SocketClient> = [];

		for (let i = 0; i < numPlayers; i++) {
			const socket = io('ws://127.0.0.1:80', {
				reconnection: false,
				forceNew: true,
			});
			const socketClient = new SocketClient(`player ${i}`, socket);

			socket.on('connect', () => {
				socketClient.login();
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
