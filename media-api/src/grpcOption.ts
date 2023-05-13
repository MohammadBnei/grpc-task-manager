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
import { MEDIA_V1ALPHA_PACKAGE_NAME } from './stubs/media/v1alpha/media';

export default (cs: ConfigService) =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: MEDIA_V1ALPHA_PACKAGE_NAME,
      url: `0.0.0.0:${cs.get('PORT') || 4000}`,
      credentials: !cs.get<boolean>('insecure')
        ? ServerCredentials.createSsl(null, [
            {
              private_key: readFileSync(cs.get('MEDIA_KEY')),
              cert_chain: readFileSync(cs.get('MEDIA_CERT')),
            },
          ])
        : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, './proto')],
      },
      protoPath: [join(__dirname, './proto/media/v1alpha/media.proto')],
    },
  } as GrpcOptions);
