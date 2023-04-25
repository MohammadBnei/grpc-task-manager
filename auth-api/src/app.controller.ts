import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  LoginRequest,
  LoginResponse,
  LoginResponse_STATUS,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ValidateRequest,
  ValidateResponse,
} from './stubs/auth/v1alpha/message';
import { AUTH_SERVICE_NAME } from './stubs/auth/v1alpha/service';
import { JwtService } from '@nestjs/jwt';
import {
  CheckPasswordResponse_STATUS,
  User,
} from './stubs/user/v1alpha/message';
import { status as RpcStatus } from '@grpc/grpc-js';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { createHash } from 'crypto';

import { IsEmail, IsIP, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

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
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
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

  @GrpcMethod(AUTH_SERVICE_NAME)
  async login(req: LoginRequest): Promise<LoginResponse> {
    try {
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
          return {
            jwt: this.jwtService.sign({ user }),
            refreshToken: rt.refreshToken,
            user,
            status: LoginResponse_STATUS.OK,
          };
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
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async RefreshToken(req: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const rt = await this.rtService.refreshToken({
        refreshToken: req.refreshToken,
      });

      if (!rt)
        throw new RpcException({
          code: RpcStatus.NOT_FOUND,
          message: 'refresh token not found',
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
        {
          id: rt.userId,
          firstName: undefined,
          lastName: undefined,
          email: undefined,
        },
        { Authorization: `Bearer ${this.jwtService.sign({ internal: true })}` },
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
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: error?.code || RpcStatus.INTERNAL,
        message: error?.message || 'something went wrong',
      });
    }
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async Validate(req: ValidateRequest): Promise<ValidateResponse> {
    try {
      const { user, internal }: { user: User; internal: boolean } =
        this.jwtService.verify(req.jwt);

      if (!internal && !user)
        throw new RpcException({
          code: RpcStatus.PERMISSION_DENIED,
          message: 'cannot verify jwt',
        });

      return {
        ok: true,
        userId: user?.id,
        userEmail: user?.email,
        userRole: user?.role,
        internal: internal,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
