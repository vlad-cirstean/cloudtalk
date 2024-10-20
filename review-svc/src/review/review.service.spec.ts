import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { AvgRating } from './entities/average-rating.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MESSAGE_QUEUE_INJECTION_TOKEN } from '../utils/constants';
import { ClientKafka } from '@nestjs/microservices';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(AvgRating),
          useValue: createMock<Repository<AvgRating>>(),
        },
        {
          provide: MESSAGE_QUEUE_INJECTION_TOKEN,
          useValue: createMock<ClientKafka>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ReviewService>(ReviewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
