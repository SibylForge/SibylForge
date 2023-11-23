import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
	constructor(private readonly jwtService: JwtService) {}

	@Post('sign')
	public async sign(@Body() body: { name: string; }): Promise<any> {
		const { name } = body;

		return this.jwtService.signAsync({
			name,
		});
	}
}
