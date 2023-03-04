import { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export default () =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: 'task.v1beta',
      url: `0.0.0.0:${process.env.PORT || 4000}`,
      credentials:
        process.env.insecure === 'false'
          ? ServerCredentials.createSsl(null, [
              {
                private_key: readFileSync(process.env.TASK_KEY),
                cert_chain: readFileSync(process.env.TASK_CERT),
              },
            ])
          : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, 'proto')],
      },
      protoPath: [join(__dirname, 'proto/task/v1beta/task.proto')],
    },
  } as GrpcOptions);

export const authGrpcOptions = (): ClientProviderOptions => {
  console.log({ api: process.env.AUTH_API_URL });
  return {
    name: 'auth',
    transport: Transport.GRPC,
    options: {
      url: process.env.AUTH_API_URL,
      package: 'auth.v1alpha',
      loader: {
        includeDirs: [join(__dirname, 'proto')],
      },
      protoPath: [join(__dirname, 'proto/auth/v1alpha/service.proto')],
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
              readFileSync(process.env.ROOT_CA),
              readFileSync(process.env.TASK_KEY),
              readFileSync(process.env.TASK_CERT),
            )
          : ChannelCredentials.createInsecure(),
    },
  };
};
