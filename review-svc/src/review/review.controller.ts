import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern('review')
  processReview(@Payload() review: ReviewDto) {
    switch (review.action) {
      case 'create':
        return this.reviewService.create(review);
      case 'update':
        return this.reviewService.update(review.id, review);
      case 'delete':
        return this.reviewService.remove(review.id);
    }
  }
}
