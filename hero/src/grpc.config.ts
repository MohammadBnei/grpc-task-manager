import { GrpcOptions, Transport } from '@nestjs/microservices';
import { HERO_V1ALPHA_PACKAGE_NAME } from './stubs/hero/v1alpha/hero';
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:6000',
    package: HERO_V1ALPHA_PACKAGE_NAME,
    protoPath: join(__dirname, 'proto/hero/v1alpha/hero.proto'),
  },
}) as GrpcOptions;
