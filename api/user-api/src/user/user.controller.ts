import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import {
  CheckPasswordRequest,
  CheckPasswordResponse,
  FindRequest,
  FindResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateRequest,
  UpdateResponse,
  CheckPasswordResponse_STATUS,
  DeleteRequest,
  DeleteResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from 'src/stubs/user/v1alpha/message';
import { status as RpcStatus } from '@grpc/grpc-js';
import { validate, ValidatorOptions } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user';
import { GrpcAuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user';
import { GRPCUser } from 'src/auth/user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService')
  async Register(req: RegisterRequest): Promise<RegisterResponse> {
    try {
      const dto: CreateUserDto = await this.validateDto(req, CreateUserDto);
      const user = await this.userService.createUser(dto);
      return { user: user as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('UserService')
  async Find(
    @Payload() req: FindRequest,
    @GRPCUser() user,
  ): Promise<FindResponse> {
    try {
      Object.keys(req).forEach((key) => req[key] === '' && delete req[key]);
      const where = {
        ...req,
        id: req.id ? +req.id : undefined,
      };
      return { user: (await this.userService.users({ where })) as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('UserService')
  async Update(
    @Payload() req: UpdateRequest,
    @GRPCUser() jwtUser,
  ): Promise<UpdateResponse> {
    try {
      // if (req.user?.id !== jwtUser.id)
      //   throw new RpcException({
      //     code: RpcStatus.PERMISSION_DENIED,
      //     message: 'you do not have acces to this resource',
      //   });

      const dto: UpdateUserDto = await this.validateDto(req, UpdateUserDto, {
        whitelist: true,
        skipMissingProperties: true,
      });

      const user = await this.userService.updateUser({
        where: {
          id: +req.id,
        },
        data: dto,
      });

      return { user: user as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod('UserService')
  async CheckPassword(
    req: CheckPasswordRequest,
  ): Promise<CheckPasswordResponse> {
    try {
      const { user, match } = await this.userService.checkPassword(
        req.email,
        req.password,
      );

      if (!user) {
        return {
          status: CheckPasswordResponse_STATUS.NOT_FOUND,
          user: undefined,
        };
      }

      if (match) {
        return {
          user: user as any,
          status: CheckPasswordResponse_STATUS.OK,
        };
      }

      return {
        status: CheckPasswordResponse_STATUS.WRONG_PASSWORD,
        user: undefined,
      };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod('UserService')
  async UpdatePassword(
    req: UpdatePasswordRequest,
  ): Promise<UpdatePasswordResponse> {
    const user = await this.userService.updateUser({
      where: { id: +req.id },
      data: {
        password: req.password,
      },
    });
    return { user: user as any };
  }

  @GrpcMethod('UserService')
  async Delete(req: DeleteRequest): Promise<DeleteResponse> {
    const user = await this.userService.deleteUser({
      id: +req.id,
    });

    return { user: user as any };
  }

  private handlePrismaErr(err: Error) {
    console.error(err);
    if (err instanceof RpcException) throw err;
    else throw new RpcException(err);
  }

  private async validateDto(
    data: any,
    Dto: any,
    validatorOptions?: ValidatorOptions,
  ) {
    const dto = plainToInstance(Dto, data);
    const errors = await validate(dto, validatorOptions);

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
    return dto as typeof Dto;
  }
}
