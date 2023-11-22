import { readFileSync } from 'fs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PacketModule } from '@/packet/packet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService<{
				JWT_PUBLIC_KEY_PATH: string;
				JWT_PRIVATE_KEY_PATH: string;
			}>) => {
				const publicKeyPath = configService.getOrThrow('JWT_PUBLIC_KEY_PATH');
				const privateKeyPath = configService.getOrThrow('JWT_PRIVATE_KEY_PATH');
				return {
					publicKey: readFileSync(publicKeyPath),
					privateKey: readFileSync(privateKeyPath),
				};
			},
			inject: [ConfigService],
		}),
		PacketModule,
	],
})
export class AppModule {}
