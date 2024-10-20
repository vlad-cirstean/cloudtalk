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
  REDIS_PRODUCT_REVIEW_KEY,
} from '../../../utils/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class ProductReviewService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductReview)
    private readonly productReviewRepo: Repository<ProductReview>,
    @Inject(MESSAGE_QUEUE_INJECTION_TOKEN)
    private readonly messageQueue: ClientKafka,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async onApplicationBootstrap() {
    await this.messageQueue.connect();
  }

  async create(
    productId: string,
    createReviewDto: CreateProductReviewDto,
  ): Promise<ProductReview> {
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

  findAllByProductId(productId: string): Promise<ProductReview[]> {
    return this.productReviewRepo.find({
      where: {
        product: { id: productId },
      },
    });
  }

  async findOne(reviewId: string): Promise<ProductReview> {
    const reviewFromCache = await this.getProductReviewFromCache(reviewId);

    if (reviewFromCache) {
      return reviewFromCache;
    } else {
      const review = await this.productReviewRepo.findOneBy({ id: reviewId });

      // responding without waiting for the cache write
      this.updateProductReviewInCache(review);
      return review;
    }
  }

  async update(
    productId: string,
    reviewId: string,
    updateReviewDto: UpdateProductReviewDto,
  ): Promise<ProductReview> {
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

    await this.updateProductReviewInCache(updatedProductReview);

    return updatedProductReview;
  }

  async remove(productId: string, reviewId: string): Promise<boolean> {
    const productReview = await this.productReviewRepo.findOneBy({
      id: reviewId,
    });
    await this.productReviewRepo.delete({ id: reviewId });

    await this.sendProductReviewEvent(
      productId,
      ProductReviewEventType.delete,
      productReview.rating,
    );

    await this.deleteProductReviewFromCache(reviewId);

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

    const plainObj = instanceToPlain(productReviewEventDto);

    await firstValueFrom(
      this.messageQueue.emit(KAFKA_PRODUCT_REVIEW_TOPIC, {
        key: productId,
        value: JSON.stringify(plainObj),
      }),
    );
  }

  private async getProductReviewFromCache(
    productReviewId: string,
  ): Promise<ProductReview | null> {
    const reviewFromCache = (await this.cacheManager.get(
      REDIS_PRODUCT_REVIEW_KEY + productReviewId,
    )) as unknown as string;
    if (reviewFromCache) {
      const parsedReviewFromCache = JSON.parse(reviewFromCache);
      return plainToInstance(ProductReview, parsedReviewFromCache);
    } else {
      return null;
    }
  }

  private async updateProductReviewInCache(productReview: ProductReview) {
    const plainObj = instanceToPlain(productReview);
    await this.cacheManager.set(
      REDIS_PRODUCT_REVIEW_KEY + productReview.id,
      JSON.stringify(plainObj),
    );
  }

  private async deleteProductReviewFromCache(productReviewId: string) {
    await this.cacheManager.del(REDIS_PRODUCT_REVIEW_KEY + productReviewId);
  }
}
