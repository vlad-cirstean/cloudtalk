import { Module } from '@nestjs/common';
import { ReviewModule } from './review/review.module';
import { HealthModule } from './health/health.module';
import { AppConfigModule,DatabaseModule, MessageQueueModule } from './core';

@Module({
  imports: [
    ReviewModule,
    AppConfigModule,
    DatabaseModule,
    MessageQueueModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
