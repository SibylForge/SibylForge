import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PacketGateway } from './packet.gateway';
import { PacketService } from './packet.service';
import { NetPacketHandler } from './handler/net/NetPacketHandler';
import { LoginPacketHandler } from './handler/net/LoginPacketHandler';
import { PlayerPacketHandler } from './handler/player/PlayerPacketHandler';
import { LogoutPacketHandler } from './handler/net/LogoutPacketHandler';

import { ApplicationModule } from '@/application/application.module';

@Module({
	imports: [
		forwardRef(() => ApplicationModule),
	],
	providers: [
		PacketGateway,
		PacketService,
		JwtService,

		NetPacketHandler,
		LoginPacketHandler,
		LogoutPacketHandler,
		PlayerPacketHandler,
	],
	exports: [PacketService],
})
export class PacketModule {}
