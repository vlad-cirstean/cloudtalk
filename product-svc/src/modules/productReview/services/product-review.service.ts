import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CreateProductReviewDto, UpdateProductReviewDto } from '../../../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductReview } from '../../../entities';
import { ClientKafka } from '@nestjs/microservices';
import {
  ProductReviewEventDto,
  ProductReviewEventType,
} from '../../../dtos/product-review-event.dto';
import { firstValueFrom } from 'rxjs';
import {
  KAFKA_PRODUCT_REVIEW_TOPIC,
  MESSAGE_QUEUE_INJECTION_TOKEN,
} from '../../../utils/constants';

@Injectable()
export class ProductReviewService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductReview)
    private readonly productReviewRepo: Repository<ProductReview>,
    @Inject(MESSAGE_QUEUE_INJECTION_TOKEN)
    private readonly messageQueue: ClientKafka,
  ) {}

  async onApplicationBootstrap() {
    await this.messageQueue.connect();
  }

  async create(productId: string, createReviewDto: CreateProductReviewDto) {
    const product = await this.productRepo.findOneBy({ id: productId });
    const productReview = new ProductReview();
    productReview.firstName = createReviewDto.firstName;
    productReview.lastName = createReviewDto.lastName;
    productReview.review = createReviewDto.review;
    productReview.rating = createReviewDto.rating;
    productReview.product = product;

    const storedProductReview =
      await this.productReviewRepo.save(productReview);
    delete storedProductReview.product;

    await this.sendProductReviewEvent(
      productId,
      ProductReviewEventType.create,
      productReview.rating,
    );

    return storedProductReview;
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

  async update(
    productId: string,
    reviewId: string,
    updateReviewDto: UpdateProductReviewDto,
  ) {
    const productReview = await this.productReviewRepo.findOneBy({
      id: reviewId,
    });
    const oldRating = productReview.rating;
    if (updateReviewDto.review) {
      productReview.review = updateReviewDto.review;
    }
    if (updateReviewDto.rating) {
      productReview.rating = updateReviewDto.rating;
    }

    const updatedProductReview =
      await this.productReviewRepo.save(productReview);

    await this.sendProductReviewEvent(
      productId,
      ProductReviewEventType.update,
      productReview.rating,
      oldRating,
    );

    return updatedProductReview;
  }

  async remove(productId: string, reviewId: string) {
    const productReview = await this.productReviewRepo.findOneBy({
      id: reviewId,
    });
    await this.productReviewRepo.delete({ id: reviewId });

    await this.sendProductReviewEvent(
      productId,
      ProductReviewEventType.delete,
      productReview.rating,
    );

    return true;
  }

  private async sendProductReviewEvent(
    productId: string,
    eventType: ProductReviewEventType,
    rating: number,
    oldRating?: number,
  ) {
    const productReviewEventDto = new ProductReviewEventDto();
    productReviewEventDto.eventType = eventType;
    productReviewEventDto.productId = productId;
    productReviewEventDto.rating = rating;
    if (oldRating) {
      productReviewEventDto.oldRating = oldRating;
    }

    await firstValueFrom(
      this.messageQueue.emit(KAFKA_PRODUCT_REVIEW_TOPIC, {
        key: productId,
        value: JSON.stringify(productReviewEventDto),
      }),
    );
  }
}
