import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './AppModule';
import { SocketIoAdapter } from './packet/SocketIoAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService<{
		WEBSOCKET_PORT: number;
	}>);
	app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  await app.listen(3000);
  console.log(`Application is running on port: ${configService.get('WEBSOCKET_PORT')}`);;
}
bootstrap();
