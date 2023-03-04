import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import grpcOption from './grpcOption';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(grpcOption());

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  const healthCheckPort = process.env.HEALTH_PORT || 3000;
  await app.startAllMicroservices();
  await app.listen(healthCheckPort);

  (async () => {
    console.log(
      `${process.env.npm_package_name}:${
        process.env.npm_package_version
      } Listening ${
        process.env.insecure === 'false' ? 'securely' : 'insecurely'
      } on port ${process.env.PORT || 4000}`,
    );
    console.log(`Health checks on port ${healthCheckPort}`);
    console.log('Server started at ', new Date());
  })();
}
bootstrap();
