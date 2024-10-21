import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { KafkaCustomTransport } from './core/kafka-custom-transport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice({
    strategy: new KafkaCustomTransport(configService.get('kafka')),
    options: configService.get('kafka'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(
    configService.get('tcp.port'),
    configService.get('tcp.host'),
  );
}
bootstrap();
