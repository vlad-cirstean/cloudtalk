import { Global, Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          ...configService.get('redis'),
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 10 * 60 * 1000, // 10 min
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CachingModule {}
