import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientsModule } from '@nestjs/microservices';
import { userGrpcOptions } from 'src/grpc.config';

@Module({
  imports: [ClientsModule.register([userGrpcOptions])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
