import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import grpcOption from './grpcOption';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  app.useLogger(logger);
  const cs = app.get(ConfigService);
  app.connectMicroservice(grpcOption(cs));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.startAllMicroservices();

  const healthCheckPort = cs.get('HEALTH_PORT');
  await app.listen(healthCheckPort);

  (async () => {
    logger.log(
      `${cs.get('npm_package_name')}:${cs.get(
        'npm_package_version',
      )} Listening ${
        !cs.get<boolean>('insecure') ? 'securely' : 'insecurely'
      } on port ${cs.get('PORT')}`,
    );
    logger.log(`Health checks on port ${healthCheckPort}`);
    logger.log('Server started at ' + new Date());
  })();
}
bootstrap();
