import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductRatingEventDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
