import { GrpcOptions, Transport } from '@nestjs/microservices';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

export default () =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: 'task.v1beta',
      url: `0.0.0.0:${process.env.PORT || 4000}`,
      loader: {
        includeDirs: [join(__dirname, 'proto')],
      },
      protoPath: [join(__dirname, 'proto/task/v1beta/task.proto')],
    },
  } as GrpcOptions);
