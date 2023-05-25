import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { HERO_V1ALPHA_PACKAGE_NAME } from './stubs/hero/v1alpha/hero';
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import {
  USER_SERVICE_NAME,
  USER_V1ALPHA_PACKAGE_NAME,
} from './stubs/user/v1alpha/service';
import { ChannelCredentials } from '@grpc/grpc-js';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:6000',
    package: HERO_V1ALPHA_PACKAGE_NAME,
    protoPath: join(__dirname, 'proto/hero/v1alpha/hero.proto'),
  },
}) as GrpcOptions;

export const userGrpcOptions: ClientProviderOptions = {
  name: USER_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: '<USER_API_URL>',
    package: USER_V1ALPHA_PACKAGE_NAME,
    loader: {
      includeDirs: [join(__dirname, './proto')],
    },
    protoPath: [join(__dirname, './proto/user/v1alpha/service.proto')],
    credentials: ChannelCredentials.createInsecure(),
  },
};
