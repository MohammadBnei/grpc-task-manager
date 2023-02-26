import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './grpcOption';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    GrpcReflectionModule.register(grpcOption),
    ClientsModule.register([
      {
        name: 'user',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:4002',
          package: 'user.v1alpha',
          protoPath: [
            join(__dirname, 'proto/user/v1alpha/service.proto'),
            join(__dirname, 'proto/user/v1alpha/message.proto'),
          ],
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
