import { GrpcOptions, Transport } from '@nestjs/microservices';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

export default addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    package: 'user.v1alpha',
    url: `0.0.0.0:4002`,
    loader: {
      includeDirs: [join(__dirname, 'proto')],
    },
    protoPath: [join(__dirname, 'proto/user/v1alpha/service.proto')],
  },
} as GrpcOptions);
