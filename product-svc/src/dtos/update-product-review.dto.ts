import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateProductReviewDto } from './create-product-review.dto';

export class UpdateProductReviewDto extends PartialType(
  PickType(CreateProductReviewDto, ['review', 'rating'] as const),
) {}
