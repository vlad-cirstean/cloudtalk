import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../../../dtos';

@Controller('v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    const x = await this.productService.findOne(productId);
    return x;
  }

  @Patch(':productId')
  update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(productId, updateProductDto);
  }

  @Delete(':productId')
  @HttpCode(204)
  async remove(@Param('productId') productId: string) {
    await this.productService.remove(productId);
  }
}
