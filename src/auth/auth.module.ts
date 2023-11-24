import { readFileSync } from 'fs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';

@Module({
	controllers: [AuthController],
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService<{
				JWT_PUBLIC_KEY_PATH: string;
				JWT_PRIVATE_KEY_PATH: string;
			}>) => {
				const publicKeyPath = configService.getOrThrow('JWT_PUBLIC_KEY_PATH');
				const privateKeyPath = configService.getOrThrow('JWT_PRIVATE_KEY_PATH');
				return {
					publicKey: readFileSync(publicKeyPath),
					privateKey: readFileSync(privateKeyPath),
					signOptions: {
						expiresIn: '1h',
						algorithm: 'RS256',
					},
				};
			},
			inject: [ConfigService],
		}),
	],
})
export class AuthModule {}
