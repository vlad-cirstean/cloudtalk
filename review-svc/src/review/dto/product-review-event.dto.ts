import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum ProductReviewEventType {
  'create',
  'update',
  'delete',
}

export class ProductReviewEventDto {
  @IsString()
  @IsNotEmpty()
  eventType: ProductReviewEventType;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsNumber()
  oldRating?: number;
}
