import { GrpcOptions, Transport } from '@nestjs/microservices';
import { TIMESHEET_V1ALPHA_PACKAGE_NAME } from './stubs/timesheet/v1_alpha/timesheet';
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:6000',
    package: TIMESHEET_V1ALPHA_PACKAGE_NAME,
    protoPath: join(__dirname, 'proto/timesheet/v1_alpha/timesheet.proto'),
  },
}) as GrpcOptions;
