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
import {
  CheckPasswordResponse_STATUS,
  FindRequest,
  User,
} from './stubs/user/v1alpha/message';
import { status as RpcStatus } from '@grpc/grpc-js';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { createHash } from 'crypto';

import { IsEmail, IsIP, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class LoginDTO {
  @IsEmail()
  email: string;

  password: string;

  @IsIP()
  ip: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
    private rtService: RefreshTokenService,
  ) {}

  private async validateDto(data: any, Dto: any) {
    const dto = plainToInstance(Dto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        message: errors
          .map(
            ({ value, property, constraints }) =>
              `${value} is not a valid ${property} value (${Object.values(
                constraints,
              ).join(', ')})`,
          )
          .join('\n'),
      });
    }
  }

  @GrpcMethod('AuthService')
  async Login(req: LoginRequest): Promise<LoginResponse> {
    await this.validateDto(req, LoginDTO);
    const { user, status } = await this.appService.checkPassword(
      req.email,
      req.password,
    );

    if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(req.ip)) {
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        message: `${req.ip} is not a valid ip address`,
      });
    }

    switch (status) {
      case CheckPasswordResponse_STATUS.OK:
        const rt = await this.rtService.createRefreshToken({
          userId: user.id,
          ip: req.ip,
          refreshToken: createHash('md5')
            .update(`${req.ip}-${user.id}-${new Date().toISOString()}`)
            .digest('hex'),
        });
        return LoginResponse.create({
          jwt: this.jwtService.sign({ user }),
          refreshToken: rt.refreshToken,
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

  @GrpcMethod('AuthService')
  async RefreshToken(req: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const rt = await this.rtService.refreshToken({
      refreshToken: req.refreshToken,
    });

    if (rt.revoked)
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        message: 'refresh token revoked',
      });

    if (rt.ip !== req.ip)
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        message: 'different ip',
      });

    const user = await this.appService.findUser(
      FindRequest.create({
        id: rt.userId,
      }),
    );

    if (!user)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'user not found',
      });

    return {
      refreshToken: undefined,
      jwt: this.jwtService.sign({ user }),
    };
  }

  @GrpcMethod('AuthService')
  async Validate(req: ValidateRequest): Promise<ValidateResponse> {
    try {
      const user = this.jwtService.verify<User>(req.jwt);
      if (!user)
        throw new RpcException({
          code: RpcStatus.PERMISSION_DENIED,
          message: 'cannot verify jwt',
        });

      return {
        ok: true,
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
