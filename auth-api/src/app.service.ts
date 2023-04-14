import { OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CheckPasswordResponse,
  FindRequest,
  FindResponse,
  User,
} from './stubs/user/v1alpha/message';
import {
  USER_SERVICE_NAME,
  USER_V1ALPHA_PACKAGE_NAME,
  UserServiceClient,
} from './stubs/user/v1alpha/service';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class AppService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(USER_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async checkPassword(
    email: string,
    password: string,
  ): Promise<CheckPasswordResponse> {
    const res: CheckPasswordResponse = await firstValueFrom(
      this.userService.checkPassword({ email, password }) as any,
    );

    return res;
  }

  async findUser(req: FindRequest, md: Record<string, any>): Promise<User> {
    const meta = new Metadata();
    Object.entries(md).map(([k, v]) => meta.add(k, v));
    const res: FindResponse = await firstValueFrom(
      this.userService.find(req, meta) as any,
    );

    return res.user?.[0];
  }
}
