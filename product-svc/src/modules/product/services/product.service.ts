import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../../../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const newProduct = new Product();
    newProduct.name = createProductDto.name;
    newProduct.description = createProductDto.description;
    newProduct.price = createProductDto.price;

    return this.productRepo.save(newProduct);
  }

  findAll() {
    return this.productRepo.find();
  }

  findOne(productId: string) {
    return this.productRepo.findOneBy({ id: productId });
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (updateProductDto.name) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.description) {
      product.description = updateProductDto.description;
    }
    if (updateProductDto.price) {
      product.price = updateProductDto.price;
    }

    return this.productRepo.save(product);
  }

  async remove(productId: string) {
    return this.productRepo.delete({ id: productId });
  }
}
