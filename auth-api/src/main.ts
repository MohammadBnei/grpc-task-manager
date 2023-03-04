import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import grpcOption from './grpcOption';
import { ConfigModule } from '@nestjs/config';
import { otelSDK } from './tracing';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  await otelSDK.start();
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(grpcOption());

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.startAllMicroservices();

  const healthCheckPort = process.env.HEALTH_PORT || 3000;
  await app.listen(healthCheckPort);

  (async () => {
    console.log(
      `Listening ${
        process.env.insecure === 'false' ? 'securely' : 'insecurely'
      } on port ${process.env.PORT || 4002}`,
    );
    console.log(`Health checks on port ${healthCheckPort}`);
  })();
}
bootstrap();
