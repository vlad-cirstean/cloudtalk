import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { ProductReviewModule } from './modules/productReview/product-review.module';
import { HealthModule } from './modules/health/health.module';
import { AppConfigModule, DatabaseModule, MessageQueueModule } from './modules/core';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    MessageQueueModule,
    ProductModule,
    ProductReviewModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule {}
