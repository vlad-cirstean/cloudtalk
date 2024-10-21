import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { KafkaOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';

export class KafkaCustomTransport
  extends Server
  implements CustomTransportStrategy
{
  private options: KafkaOptions['options'];
  private kafkaClient: Kafka;
  private consumer: Consumer;
  private producer: Producer;

  constructor(options: KafkaOptions['options']) {
    super();
    this.options = options;
    // TODO: use nest default logger
    this.kafkaClient = new Kafka({
      ...this.options.client,
    });

    this.consumer = this.kafkaClient.consumer(this.options.consumer);
    this.producer = this.kafkaClient.producer(this.options.producer);
  }

  async listen(callback: () => void) {
    await this.consumer.connect();

    const handlers = this.getHandlers();
    const handlerKeys = Array.from(handlers.keys());

    await this.consumer.subscribe({
      topics: handlerKeys,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachBatchAutoResolve: true,
      eachBatch: this.eachBatchHandler.bind(this),
    });
    callback();
  }

  async close() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }

  private async eachBatchHandler({ batch, resolveOffset, heartbeat }) {
    const promises = [];

    for (const message of batch.messages) {
      const handlers = this.getHandlers();

      const messageHandler = handlers.get(batch.topic);
      // TODO: add proper validation based on DTO
      const parsedMessage = JSON.parse(message.value.toString());
      // TODO: handle errors
      const messagePromise = messageHandler(parsedMessage);
      // TODO: throttle promise execution
      // TODO: also return CTX object
      promises.push(messagePromise);

      resolveOffset(message.offset);
      await heartbeat();
    }

    await Promise.all(promises);
  }
}
