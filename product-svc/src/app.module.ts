import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { ProductReviewModule } from './modules/productReview/product-review.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule, KafkaModule } from './resources';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    KafkaModule,
    ProductModule,
    ProductReviewModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule {}
