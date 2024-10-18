import { Column, Entity, OneToMany } from 'typeorm';
import { ProductReview } from './product-review.entity';
import { Base } from './base.entity';
import { DecimalTransformer } from '../utils';

@Entity({ name: 'product' })
export class Product extends Base {
  @Column({ length: 20 })
  name: string;

  @Column({ length: 200 })
  description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  price: number;

  @OneToMany(() => ProductReview, (review) => review.product)
  reviews: ProductReview[];
}
