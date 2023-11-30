import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PacketGateway } from './packet.gateway';
import { PacketService } from './packet.service';
import { NetPacketHandler } from './handler/net/NetPacketHandler';
import { LoginPacketHandler } from './handler/net/LoginPacketHandler';
import { LogoutPacketHandler } from './handler/net/LogoutPacketHandler';
import { PlayerPacketHandler } from './handler/player/PlayerPacketHandler';
import { ChatPacketHandler } from './handler/player/ChatPacketHandler';


@Module({
	providers: [
		PacketGateway,
		PacketService,
		JwtService,

		NetPacketHandler,
		LoginPacketHandler,
		LogoutPacketHandler,
		PlayerPacketHandler,
		ChatPacketHandler,
	],
})
export class PacketModule {}
