import { Inject, Injectable } from '@nestjs/common';
import {
  ProductReviewEventDto,
  ProductReviewEventType,
} from './dto/product-review-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AvgRating } from './entities/average-rating.entity';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { ProductRatingEventDto } from './dto/product-rating-event.dto';
import {
  KAFKA_PRODUCT_RATING_TOPIC,
  MESSAGE_QUEUE_INJECTION_TOKEN,
} from '../utils/constants';
import { firstValueFrom } from 'rxjs';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(AvgRating)
    private readonly avgRatingRepo: Repository<AvgRating>,
    @Inject(MESSAGE_QUEUE_INJECTION_TOKEN)
    private readonly messageQueue: ClientKafka,
  ) {}

  async processReview(productReviewEventDto: ProductReviewEventDto) {
    const avgRating = await this.avgRatingRepo.findOneBy({
      productId: productReviewEventDto.productId,
    });

    switch (productReviewEventDto.eventType) {
      case ProductReviewEventType.create:
        await this.processProductReviewCreateEvent(
          productReviewEventDto,
          avgRating,
        );
        break;
      case ProductReviewEventType.update:
        await this.processProductReviewUpdateEvent(
          productReviewEventDto,
          avgRating,
        );
        break;
      case ProductReviewEventType.delete:
        await this.processProductDeleteUpdateEvent(
          productReviewEventDto,
          avgRating,
        );
        break;
    }
  }

  async processProductReviewCreateEvent(
    productReviewEventDto: ProductReviewEventDto,
    avgRating: AvgRating,
  ) {
    if (!avgRating) {
      avgRating = new AvgRating();
      avgRating.productId = productReviewEventDto.productId;
      avgRating.average = productReviewEventDto.rating;
      avgRating.ratingsCount = 1;
    } else {
      avgRating.average = this.addToAverage(
        avgRating.average,
        avgRating.ratingsCount,
        productReviewEventDto.rating,
      );
      avgRating.ratingsCount++;
    }

    await this.avgRatingRepo.save(avgRating);

    await this.sendProductRatingEvent(avgRating.productId, avgRating.average);
  }

  async processProductReviewUpdateEvent(
    productReviewEventDto: ProductReviewEventDto,
    avgRating: AvgRating,
  ) {
    if (avgRating?.ratingsCount <= 1) {
      avgRating = new AvgRating();
      avgRating.productId = productReviewEventDto.productId;
      avgRating.average = productReviewEventDto.rating;
      avgRating.ratingsCount = 1;
    } else {
      avgRating.average = this.subtractFromAverage(
        avgRating.average,
        avgRating.ratingsCount,
        productReviewEventDto.oldRating,
      );
      avgRating.average = this.addToAverage(
        avgRating.average,
        avgRating.ratingsCount,
        productReviewEventDto.rating,
      );
    }
    await this.avgRatingRepo.save(avgRating);

    await this.sendProductRatingEvent(avgRating.productId, avgRating.average);
  }

  async processProductDeleteUpdateEvent(
    productReviewEventDto: ProductReviewEventDto,
    avgRating: AvgRating,
  ) {
    if (avgRating.ratingsCount <= 1) {
      await this.avgRatingRepo.delete({
        productId: productReviewEventDto.productId,
      });

      await this.sendProductRatingEvent(avgRating.productId, 0);
    } else {
      avgRating.average = this.subtractFromAverage(
        avgRating.average,
        avgRating.ratingsCount,
        productReviewEventDto.rating,
      );
      avgRating.ratingsCount--;

      await this.avgRatingRepo.save(avgRating);

      await this.sendProductRatingEvent(avgRating.productId, avgRating.average);
    }
  }

  private addToAverage(average: number, count: number, newValue: number) {
    return (average * count + newValue) / (count + 1);
  }

  private subtractFromAverage(
    average: number,
    count: number,
    oldValue: number,
  ) {
    return (average * count - oldValue) / (count - 1);
  }

  private async sendProductRatingEvent(
    productId: string,
    averageRating: number,
  ) {
    const productRatingEventDto = new ProductRatingEventDto();
    productRatingEventDto.productId = productId;
    productRatingEventDto.rating = parseFloat(averageRating.toFixed(2));

    const plainObj = instanceToPlain(productRatingEventDto);

    await firstValueFrom(
      this.messageQueue.emit(KAFKA_PRODUCT_RATING_TOPIC, {
        key: productId,
        value: JSON.stringify(plainObj),
      }),
    );
  }
}
