import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import grpcOption from './grpc.option';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.connectMicroservice(grpcOption(configService));

  app.startAllMicroservices();
  app.listen(6006);
}
bootstrap();
