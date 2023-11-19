import { Module } from '@nestjs/common';

import { NetService } from './NetService';
import { PlayerService } from './PlayerService';

@Module({
	providers: [NetService, PlayerService],
})
export class ServiceModule {}
