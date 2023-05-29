import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { grpcConfig } from './grpc.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cs = app.get(ConfigService);

  app.connectMicroservice(grpcConfig(cs));
  await app.startAllMicroservices();

  await app.listen(8888);
}
bootstrap();
