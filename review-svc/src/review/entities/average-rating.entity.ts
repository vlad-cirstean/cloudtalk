import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'average_rating' })
export class AvgRating {
  @PrimaryColumn({ length: 36, name: 'product_id' })
  productId: string;

  @Column({ type: 'double' })
  average: number;

  @Column()
  ratingsCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
