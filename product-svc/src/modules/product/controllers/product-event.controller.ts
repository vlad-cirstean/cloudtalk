import { Controller } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductRatingEventDto } from '../../../dtos/product-rating-event.dto';
import { KAFKA_PRODUCT_RATING_TOPIC } from '../../../utils/constants';

@Controller()
export class ProductEventController {
  constructor(private readonly productService: ProductService) {}

  @EventPattern(KAFKA_PRODUCT_RATING_TOPIC)
  processReview(@Payload() productRatingEventDto: ProductRatingEventDto) {
    return this.productService.updateRating(productRatingEventDto);
  }
}
