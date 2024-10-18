import { Module } from '@nestjs/common';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forRootAsync({
      name: '',
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('mysql.host'),
          port: configService.get('mysql.port'),
          username: configService.get('mysql.user'),
          password: configService.get('mysql.pass'),
          database: configService.get('mysql.db'),
          entities: [],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
