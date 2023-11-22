import { Module } from '@nestjs/common';

import { NetService } from './net.service';
import { PlayerService } from './player.service';

@Module({
	providers: [NetService, PlayerService],
})
export class ServiceModule {}
