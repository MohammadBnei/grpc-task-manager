import { GrpcOptions, Transport } from '@nestjs/microservices';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

export default addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    package: 'auth.v1alpha',
    url: `0.0.0.0:4003`,
    loader: {
      includeDirs: [join(__dirname, 'proto')],
    },
    protoPath: [join(__dirname, 'proto/auth/v1alpha/service.proto')],
  },
} as GrpcOptions);
