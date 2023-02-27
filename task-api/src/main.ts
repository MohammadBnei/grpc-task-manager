import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import grpcOption from './grpcOption';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(grpcOption());

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(3000);
  await app.startAllMicroservices();
}
bootstrap();
