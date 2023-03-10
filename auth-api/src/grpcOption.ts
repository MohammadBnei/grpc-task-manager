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

export default (cs: ConfigService): GrpcOptions =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: 'auth.v1alpha',
      url: `0.0.0.0:${cs.get('PORT') || 4003}`,
      credentials:
        cs.get('insecure') === 'false'
          ? ServerCredentials.createSsl(null, [
              {
                private_key: readFileSync(cs.get('AUTH_KEY')),
                cert_chain: readFileSync(cs.get('AUTH_CERT')),
              },
            ])
          : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, 'proto')],
      },
      protoPath: [join(__dirname, './proto/auth/v1alpha/service.proto')],
    },
  });

export const userGrpcOptions = (cs: ConfigService): ClientProviderOptions => ({
  name: 'USER_SERVICE',
  transport: Transport.GRPC,
  options: {
    url: cs.get('USER_API_URL'),
    package: 'user.v1alpha',
    loader: {
      includeDirs: [join(__dirname, 'proto')],
    },
    protoPath: [join(__dirname, 'proto/user/v1alpha/service.proto')],
    keepalive: {
      // Send keepalive pings every 10 seconds, default is 2 hours.
      keepaliveTimeMs: 10 * 1000,
      // Keepalive ping timeout after 5 seconds, default is 20 seconds.
      keepaliveTimeoutMs: 5 * 1000,
      // Allow keepalive pings when there are no gRPC calls.
      keepalivePermitWithoutCalls: 1,
    },
    credentials:
      cs.get('insecure') === 'false'
        ? ChannelCredentials.createSsl(
            readFileSync(cs.get('ROOT_CA')),
            readFileSync(cs.get('AUTH_KEY')),
            readFileSync(cs.get('AUTH_CERT')),
          )
        : ChannelCredentials.createInsecure(),
  },
});
