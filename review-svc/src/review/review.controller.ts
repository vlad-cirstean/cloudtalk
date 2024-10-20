import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import { ProductReviewEventDto } from './dto/product-review-event.dto';
import { KAFKA_PRODUCT_REVIEW_TOPIC } from '../utils/constants';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @EventPattern(KAFKA_PRODUCT_REVIEW_TOPIC)
  processReview(@Payload() review: ProductReviewEventDto) {
    return this.reviewService.processReview(review);
  }
}
