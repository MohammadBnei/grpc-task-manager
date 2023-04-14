import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { authGrpcOptions } from 'src/config/grpc.option';
import { AuthService } from './auth.service';
import { AUTH_V1ALPHA_PACKAGE_NAME } from 'src/stubs/auth/v1alpha/service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: AUTH_V1ALPHA_PACKAGE_NAME,
        useFactory: (cs: ConfigService) => authGrpcOptions(cs),
      },
    ]),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
