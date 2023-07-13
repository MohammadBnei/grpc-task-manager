import { status } from '@grpc/grpc-js';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { ValidateResponse } from 'src/stubs/auth/v1alpha/message';
import { UserRole } from 'src/stubs/user/v1alpha/message';
import { AuthService } from './auth.service';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get<UserRole[]>(
        'roles',
        context.getHandler(),
      );
      const request = context.switchToRpc().getContext();

      const type = context.getType();
      const prefix = 'Bearer ';

      let header: any;
      if (type === 'rpc') {
        const metadata = context.getArgByIndex(1);
        if (!metadata) {
          throw new Error('no metadata provided');
        }
        header = metadata.get('Authorization')[0];
      }

      if (!header || !header.includes(prefix)) {
        throw new Error('header malformed');
      }

      const token = header.slice(header.indexOf(' ') + 1);

      const res: ValidateResponse = await this.authService.validate(token);

      if (res?.ok !== true) {
        throw new RpcException({});
      }

      if (res.internal) {
        return true;
      }

      if (roles && !roles.includes(res.userRole)) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: `authorized roles : ${roles.join(', ')}`,
        });
      }

      request.user = {
        id: res.userId,
        email: res.userEmail,
        role: res.userRole,
      };

      return true;
    } catch (error) {
      console.log({ error });
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: error?.details || error.message,
      });
    }
  }
}
