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

export const authGrpcOption = (cs: ConfigService): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    url: cs.get('AUTH_URL'),
    package: 'auth.v1alpha',
    loader: {
      includeDirs: [join(__dirname, 'proto')],
    },
    protoPath: join(__dirname, 'proto/auth/v1alpha/service.proto'),
  },
});
