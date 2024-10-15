import { Module } from '@nestjs/common';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ReviewModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'review-svc',
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get('kafka.clientId'),
                brokers: configService.get('kafka.brokers'),
              },
              consumer: {
                groupId: configService.get('kafka.consumerGroup'),
              },
            },
          } as KafkaOptions;
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
