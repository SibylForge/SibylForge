import { Module } from '@nestjs/common';

import { PacketGateway } from './PacketGateway';

@Module({
    providers: [PacketGateway],
})
export class PacketModule {}
