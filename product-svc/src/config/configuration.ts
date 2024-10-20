import {
  KafkaOptions,
  TcpOptions,
} from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Partitioners } from 'kafkajs';
import type { RedisClientOptions } from 'redis';

type Configuration = {
  env: 'development' | 'production';
  tcp: TcpOptions['options'];
  mysql: TypeOrmModuleOptions;
  kafka: KafkaOptions['options'];
  redis: RedisClientOptions;
};
export default (): Configuration => ({
  env: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  tcp: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '0.0.0.0',
  },
  mysql: {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    entities: [__dirname + '/../**/*.entity.js'],
    synchronize: process.env.NODE_ENV === 'development',
  },
  kafka: {
    client: {
      brokers: process.env.KAFKA_BROKERS?.split(','),
      clientId: process.env.KAFKA_CLIENT_ID,
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
    },
    producer: {
      createPartitioner: Partitioners.LegacyPartitioner,
    },
  },
  redis: {
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
  },
});
