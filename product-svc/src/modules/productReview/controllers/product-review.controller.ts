import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductReviewService } from '../services/product-review.service';
import { CreateProductReviewDto, UpdateProductReviewDto } from '../../../dtos';

@Controller('v1/product/:productId/review')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @Post()
  create(
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateProductReviewDto,
  ) {
    return this.productReviewService.create(productId, createReviewDto);
  }

  @Get()
  findAllByProductId(@Param('productId') productId: string) {
    return this.productReviewService.findAllByProductId(productId);
  }

  @Get(':reviewId')
  findOne(@Param('reviewId') reviewId: string) {
    return this.productReviewService.findOne(reviewId);
  }

  @Patch(':reviewId')
  update(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateProductReviewDto,
  ) {
    return this.productReviewService.update(reviewId, updateReviewDto);
  }

  @Delete(':reviewId')
  remove(@Param('reviewId') reviewId: string) {
    return this.productReviewService.remove(reviewId);
  }
}
