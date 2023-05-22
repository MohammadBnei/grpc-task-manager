import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HERO_V1ALPHA_PACKAGE_NAME } from './stubs/hero/v1alpha/hero';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:6000',
        package: HERO_V1ALPHA_PACKAGE_NAME,
        protoPath: join(__dirname, 'proto/hero/v1alpha/hero.proto'),
      },
    },
  );

  await app.listen();
}
bootstrap();
