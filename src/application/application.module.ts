import { Module, forwardRef } from '@nestjs/common';

import { PacketModule } from '@/packet/packet.module';

import { Chat } from './communication/Chat';

@Module({
	imports: [
		forwardRef(() => PacketModule),
	],
	providers: [Chat],
	exports: [Chat],
})
export class ApplicationModule {}
