import { Global, Module } from '@nestjs/common';
import configuration from '../../config/configuration';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
