import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthSignRequest, AuthSignResponse } from './auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly jwtService: JwtService) {}

	@Post('sign')
	public async sign(@Body() body: AuthSignRequest): Promise<AuthSignResponse> {
		const { name } = body;

		return {
			token: this.jwtService.sign({ name }),
		};
	}
}
