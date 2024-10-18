import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA',
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
})
export class KafkaModule {}
