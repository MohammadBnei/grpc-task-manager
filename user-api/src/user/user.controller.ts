import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
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
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { status } from '@grpc/grpc-js';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  handlePrismaErr(err: Error) {
    console.error(err);
    if (err instanceof RpcException) throw err;
    else throw new RpcException(err);
  }

  @Span('Register')
  @GrpcMethod('UserService')
  async Register(req: RegisterRequest): Promise<RegisterResponse> {
    try {
      const user = await this.userService.createUser(req);
      return { user: user as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @Span()
  @GrpcMethod('UserService')
  async Find(req: FindRequest): Promise<FindResponse> {
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

  @Span()
  @GrpcMethod('UserService')
  async Update(req: UpdateRequest): Promise<UpdateResponse> {
    try {
      delete req.user.createdAt;
      delete req.user.updatedAt;

      const user = await this.userService.updateUser({
        where: {
          id: +req.user.id,
        },
        data: req.user as any,
      });

      return { user: user as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @Span()
  @GrpcMethod('UserService')
  async CheckPassword(
    req: CheckPasswordRequest,
  ): Promise<CheckPasswordResponse> {
    try {
      const user = await this.userService.checkPassword(
        req.email,
        req.password,
      );

      if (user) {
        return CheckPasswordResponse.create({
          user: user as any,
          status: CheckPasswordResponse_STATUS.OK,
        });
      }

      return CheckPasswordResponse.create({
        status: CheckPasswordResponse_STATUS.WRONG_PASSWORD,
      });
    } catch (error) {
      if (error?.code === status.NOT_FOUND) {
        return CheckPasswordResponse.create({
          status: CheckPasswordResponse_STATUS.NOT_FOUND,
        });
      }
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
}
