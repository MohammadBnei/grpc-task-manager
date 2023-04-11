import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authGrpcOptions } from 'src/grpcOption';
import { AuthService } from './auth.service';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'AUTH_SERVICE',
        useFactory: (cs: ConfigService) => authGrpcOptions(cs),
      },
    ]),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
