import { Column, Entity, ManyToOne } from 'typeorm';
import { IsInt, Max, Min } from 'class-validator';
import { Product } from './product.entity';
import { Base } from './base.entity';

@Entity({ name: 'product_review' })
export class ProductReview extends Base {
  @ManyToOne(() => Product, (product) => product.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ length: 20 })
  firstName: string;

  @Column({ length: 20 })
  lastName: string;

  @Column({ length: 200 })
  review: string;

  @Column()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
