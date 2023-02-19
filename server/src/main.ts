import { ServerCredentials } from '@grpc/grpc-js';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${process.env.PORT || 4000}`,
        credentials: !process.env.insecure
          ? ServerCredentials.createSsl(null, [
              {
                private_key: readFileSync(process.env.KEY),
                cert_chain: readFileSync(process.env.CERT),
              },
            ])
          : ServerCredentials.createInsecure(),
        package: 'task.v1beta',
        protoPath: join(__dirname, process.env.PROTO_PATH),
      },
    },
  );

  await app.listen();
}
bootstrap();
