import { Module } from '@nestjs/common';

import { EventGateway } from './EventGateway';

@Module({
    providers: [EventGateway],
})
export class EventModule {}
