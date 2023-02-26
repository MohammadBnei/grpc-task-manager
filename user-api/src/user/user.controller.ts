import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  FindRequest,
  FindResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateRequest,
  UpdateResponse,
} from 'src/stubs/user/v1alpha/message';
import { Span } from '@metinseylan/nestjs-opentelemetry';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  handlePrismaErr(err: Error) {
    console.error(err);
    throw new RpcException(err);
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
        where: req.user.id
          ? {
              id: +req.user.id,
            }
          : {
              email: req.user.email,
            },
        data: req.user as any,
      });

      return { user: user as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  // @GrpcMethod('UserService')
  // UpdatePassword(updateUserDto: UpdateUserDto): Promise<RegisterResponse> {
  //   return this.userService.updateUser(updateUserDto.id, updateUserDto);
  // }

  // @GrpcMethod('UserService')
  // Delete(id: number): Promise<RegisterResponse> {
  //   return this.userService.remove(id);
  // }
}
