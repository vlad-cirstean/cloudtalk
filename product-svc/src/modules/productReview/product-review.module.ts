import { Module } from '@nestjs/common';
import { ProductReviewService } from './services/product-review.service';
import { ProductReviewController } from './controllers/product-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductReview } from '../../entities';

@Module({
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
  imports: [TypeOrmModule.forFeature([Product, ProductReview])],
})
export class ProductReviewModule {}
