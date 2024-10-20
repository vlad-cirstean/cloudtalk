import { Test, TestingModule } from '@nestjs/testing';
import { ProductReviewService } from './product-review.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductReview } from '../../../entities';
import { createMock } from '@golevelup/ts-jest';
import {ClientKafka} from "@nestjs/microservices";
import {MESSAGE_QUEUE_INJECTION_TOKEN} from "../../../utils/constants";

describe('ProductReviewService', () => {
  let service: ProductReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductReviewService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMock<Repository<Product>>(),
        },
        {
          provide: getRepositoryToken(ProductReview),
          useValue: createMock<Repository<ProductReview>>(),
        },
        {
          provide: MESSAGE_QUEUE_INJECTION_TOKEN,
          useValue: createMock<ClientKafka>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ProductReviewService>(ProductReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
