import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { grpcOption } from './grpcOption';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cs = app.get(ConfigService);
  app.connectMicroservice(grpcOption(cs));
  await app.startAllMicroservices();
  await app.listen(8888);
}

bootstrap();
