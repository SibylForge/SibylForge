import { Module } from '@nestjs/common';

import { PacketModule } from '@packet/PacketModule';

@Module({
  imports: [PacketModule],
})
export class AppModule {}
