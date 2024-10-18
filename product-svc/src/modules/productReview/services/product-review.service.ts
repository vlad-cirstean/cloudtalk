import { Injectable } from '@nestjs/common';
import { CreateProductReviewDto, UpdateProductReviewDto } from '../../../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductReview } from '../../../entities';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductReview)
    private readonly productReviewRepo: Repository<ProductReview>,
  ) {}

  async create(productId: string, createReviewDto: CreateProductReviewDto) {
    const product = await this.productRepo.findOneBy({ id: productId });
    const productReview = new ProductReview();
    productReview.firstName = createReviewDto.firstName;
    productReview.lastName = createReviewDto.lastName;
    productReview.review = createReviewDto.review;
    productReview.rating = createReviewDto.rating;
    productReview.product = product;

    return this.productReviewRepo.save(productReview);
  }

  findAllByProductId(productId: string) {
    return this.productReviewRepo.find({
      where: {
        product: { id: productId },
      },
    });
  }

  findOne(reviewId: string) {
    return this.productReviewRepo.findOneBy({ id: reviewId });
  }

  async update(reviewId: string, updateReviewDto: UpdateProductReviewDto) {
    const productReview = await this.productReviewRepo.findOneBy({
      id: reviewId,
    });
    if (updateReviewDto.review) {
      productReview.review = updateReviewDto.review;
    }
    if (updateReviewDto.rating) {
      productReview.rating = updateReviewDto.rating;
    }

    return this.productReviewRepo.save(productReview);
  }

  remove(reviewId: string) {
    return this.productReviewRepo.delete({ id: reviewId });
  }
}
