import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

export default (cs: ConfigService): GrpcOptions =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:' + cs.get<number>('PORT'),
      package: 'hero.v1alpha',
      protoPath: join(__dirname, 'hero/hero.proto'),
    },
  });
