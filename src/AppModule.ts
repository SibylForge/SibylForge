import { Module } from '@nestjs/common';

import { EventModule } from '@event/EventModule';

@Module({
  imports: [EventModule],
})
export class AppModule {}
