import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PacketModule } from '@/packet/packet.module';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
		PacketModule,
		AuthModule,
	],
})
export class AppModule {}
