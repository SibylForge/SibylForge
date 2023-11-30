import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { Config } from './config';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './packet/SocketIoAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService<Config>);
	app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
	app.enableCors();

  await app.listen(3000);
  console.log(`Application is running on port: ${configService.get('WEBSOCKET_PORT')}`);;
}
bootstrap();
