import { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';
import { AUTH_V1ALPHA_PACKAGE_NAME } from 'src/stubs/auth/v1alpha/service';
import { USER_V1ALPHA_PACKAGE_NAME } from 'src/stubs/user/v1alpha/service';

export default (cs: ConfigService): GrpcOptions => {
  return addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: AUTH_V1ALPHA_PACKAGE_NAME,
      url: `0.0.0.0:${cs.get('PORT')}`,
      credentials: !cs.get<boolean>('insecure')
        ? ServerCredentials.createSsl(null, [
            {
              private_key: readFileSync(cs.get('AUTH_KEY')),
              cert_chain: readFileSync(cs.get('AUTH_CERT')),
            },
          ])
        : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../proto/auth/v1alpha/service.proto')],
    },
  });
};

export const userGrpcOptions = (cs: ConfigService): ClientProviderOptions => ({
  name: USER_V1ALPHA_PACKAGE_NAME,
  transport: Transport.GRPC,
  options: {
    url: cs.get('USER_API_URL'),
    package: USER_V1ALPHA_PACKAGE_NAME,
    loader: {
      includeDirs: [join(__dirname, '../proto')],
    },
    protoPath: [join(__dirname, '../proto/user/v1alpha/service.proto')],
    keepalive: {
      // Send keepalive pings every 10 seconds, default is 2 hours.
      keepaliveTimeMs: 10 * 1000,
      // Keepalive ping timeout after 5 seconds, default is 20 seconds.
      keepaliveTimeoutMs: 5 * 1000,
      // Allow keepalive pings when there are no gRPC calls.
      keepalivePermitWithoutCalls: 1,
    },
    credentials: !cs.get<boolean>('insecure')
      ? ChannelCredentials.createSsl(
          readFileSync(cs.get('ROOT_CA')),
          readFileSync(cs.get('AUTH_KEY')),
          readFileSync(cs.get('AUTH_CERT')),
        )
      : ChannelCredentials.createInsecure(),
  },
});
