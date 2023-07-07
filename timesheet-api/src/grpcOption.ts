import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { TIMESHEET_V1ALPHA_PACKAGE_NAME } from './stubs/timesheet/v1_alpha/timesheet';
import { join } from 'path';

export const grpcOption = (cs: ConfigService): GrpcOptions =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${cs.get<number>('PORT') || 4004}`,
      package: TIMESHEET_V1ALPHA_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/timesheet/v1_alpha/timesheet.proto'),
    },
  });
