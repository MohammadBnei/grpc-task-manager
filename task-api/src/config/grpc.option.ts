import { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export default (cs: ConfigService) =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: 'task.v1beta',
      url: `0.0.0.0:${cs.get('PORT')}`,
      credentials: !cs.get<boolean>('insecure')
        ? ServerCredentials.createSsl(null, [
            {
              private_key: readFileSync(cs.get('TASK_KEY')),
              cert_chain: readFileSync(cs.get('TASK_CERT')),
            },
          ])
        : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../proto/task/v1beta/task.proto')],
    },
  } as GrpcOptions);

export const authGrpcOptions = (cs: ConfigService): ClientProviderOptions => {
  return {
    name: 'AUTH_SERVICE',
    transport: Transport.GRPC,
    options: {
      url: cs.get('AUTH_API_URL'),
      package: 'auth.v1alpha',
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../proto/auth/v1alpha/service.proto')],
      keepalive: {
        // Send keepalive pings every 10 seconds, default is 2 hours.
        keepaliveTimeMs: 10 * 1000,
        // Keepalive ping timeout after 5 seconds, default is 20 seconds.
        keepaliveTimeoutMs: 5 * 1000,
        // Allow keepalive pings when there are no gRPC calls.
        keepalivePermitWithoutCalls: 1,
      },
      credentials:
        process.env.insecure === 'false'
          ? ChannelCredentials.createSsl(
              readFileSync(cs.get('ROOT_CA')),
              readFileSync(cs.get('TASK_KEY')),
              readFileSync(cs.get('TASK_CERT')),
            )
          : ChannelCredentials.createInsecure(),
    },
  };
};
