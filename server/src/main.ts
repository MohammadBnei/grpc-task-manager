import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${process.env.PORT || 4000}`,
        package: 'task.v1alpha',
        protoPath: join(__dirname, process.env.PROTO_FILE),
      },
    },
  );

  await app.listen();
}
bootstrap();
