import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities';
import { ProductEventController } from './controllers/product-event.controller';

@Module({
  controllers: [ProductController, ProductEventController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductModule {}
