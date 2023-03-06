import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import grpcOption from './grpcOption';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.connectMicroservice(grpcOption());

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.startAllMicroservices();

  const healthCheckPort = process.env.HEALTH_PORT || 3000;
  await app.listen(healthCheckPort);

  (async () => {
    if (process.env.NODE_ENV === 'production') return;
    logger.log(
      `${process.env.npm_package_name}:${
        process.env.npm_package_version
      } Listening ${
        process.env.insecure === 'false' ? 'securely' : 'insecurely'
      } on port ${process.env.PORT || 4002}`,
    );
    logger.log(`Health checks on port ${healthCheckPort}`);
    logger.log('Server started at ', new Date());
  })();
}
bootstrap();
