import { ServerCredentials } from '@grpc/grpc-js';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

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
