import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ValidateRequest,
  ValidateResponse,
} from './stubs/auth/v1alpha/message';
import { JwtService } from '@nestjs/jwt';
import { CheckPasswordResponse_STATUS } from './stubs/user/v1alpha/message';
import { status as RpcStatus } from '@grpc/grpc-js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @GrpcMethod('AuthService')
  async Login(req: LoginRequest): Promise<LoginResponse> {
    const { user, status } = await this.appService.checkPassword(
      req.email,
      req.password,
    );

    switch (status) {
      case CheckPasswordResponse_STATUS.OK:
        return LoginResponse.create({
          jwt: this.jwtService.sign({ user }, { secret: 'super-secret' }),
        });
      case CheckPasswordResponse_STATUS.WRONG_PASSWORD:
        throw new RpcException({
          code: RpcStatus.INVALID_ARGUMENT,
          message: 'wrong password',
        });
      case CheckPasswordResponse_STATUS.INTERNAL:
        throw new RpcException('Something went wrong');
      case CheckPasswordResponse_STATUS.NOT_FOUND:
        throw new RpcException({
          code: RpcStatus.NOT_FOUND,
          message: `user with email ${req.email} not found`,
        });
      default:
        break;
    }
  }

  // @GrpcMethod('AuthService')
  // async RefreshToken(req: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  //   return {};
  // }
  // @GrpcMethod('AuthService')
  // async Validate(req: ValidateRequest): Promise<ValidateResponse> {
  //   return {};
  // }
}
