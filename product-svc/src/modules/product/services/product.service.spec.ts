import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../../entities';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMock<Repository<Product>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
