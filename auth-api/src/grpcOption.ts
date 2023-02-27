import { ServerCredentials } from '@grpc/grpc-js';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

export default (): GrpcOptions =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: 'auth.v1alpha',
      url: `0.0.0.0:${process.env.PORT || 4003}`,
      credentials: !process.env.insecure
        ? ServerCredentials.createSsl(null, [
            {
              private_key: readFileSync(process.env.AUTH_KEY),
              cert_chain: readFileSync(process.env.AUTH_CERT),
            },
          ])
        : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, 'proto')],
      },
      protoPath: [join(__dirname, 'proto/auth/v1alpha/service.proto')],
    },
  });
