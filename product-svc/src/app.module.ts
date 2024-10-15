import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
    ProductModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
