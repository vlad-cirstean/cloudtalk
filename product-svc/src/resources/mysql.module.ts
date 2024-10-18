import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql.host'),
        port: configService.get('mysql.port'),
        username: configService.get('mysql.user'),
        password: configService.get('mysql.pass'),
        database: configService.get('mysql.db'),
        entities: [__dirname + '/../**/*.entity.js'],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
