import { Injectable } from '@nestjs/common';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  create(createReviewDto: ReviewDto) {
    return 'This action adds a new review';
  }

  findOne(id: string) {
    return `This action returns a #${id} review`;
  }

  update(id: string, updateReviewDto: ReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: string) {
    return `This action removes a #${id} review`;
  }
}
