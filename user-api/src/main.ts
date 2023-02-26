import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user.v1alpha',
        url: `0.0.0.0:4002`,
        protoPath: [
          join(__dirname, 'proto/user/v1alpha/service.proto'),
          join(__dirname, 'proto/user/v1alpha/message.proto'),
        ],
      },
    },
  );
  await app.listen();
}
bootstrap();
