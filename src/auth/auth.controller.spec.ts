import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';

describe('AuthController', () => {
	let jwtService: JwtService;
	let authController: AuthController;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ envFilePath: 'test.env'}),
				AuthModule,
			],
		}).compile();
		jwtService = moduleFixture.get(JwtService);

		authController = new AuthController(jwtService);
	});

	it('/sign (POST)', async () => {
		const { token } = await authController.sign({ name: '1234' });
		const decrypted = jwtService.decode(token);
		expect(decrypted.name).toBe('1234');
	});
});
