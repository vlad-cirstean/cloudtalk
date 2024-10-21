import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MESSAGE_QUEUE_INJECTION_TOKEN } from '../utils/constants';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MESSAGE_QUEUE_INJECTION_TOKEN,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            ...configService.get('kafka'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MessageQueueModule {}
