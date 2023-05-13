import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import grpcOption from './grpcOption';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cs = app.get(ConfigService);
  app.connectMicroservice(grpcOption(cs));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.startAllMicroservices();

  const healthCheckPort = cs.get('HEALTH_PORT');
  await app.listen(healthCheckPort);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await (async () => {
    console.log(
      `${cs.get('npm_package_name')}:${cs.get(
        'npm_package_version',
      )} Listening ${
        !cs.get<boolean>('insecure') ? 'securely' : 'insecurely'
      } on port ${cs.get('PORT')}`,
    );
    console.log(`Health checks on port ${healthCheckPort}`);
    console.log('Server started at ' + new Date());
  })();
}
bootstrap();
