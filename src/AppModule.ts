import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PacketModule } from '@/packet/PacketModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
		PacketModule,
	],
})
export class AppModule {}
