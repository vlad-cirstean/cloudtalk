import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductReviewDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  lastName: string;

  @IsString()
  @MaxLength(200)
  review: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
