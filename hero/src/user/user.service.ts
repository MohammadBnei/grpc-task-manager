import { OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { FindRequest, FindResponse, User } from '../stubs/user/v1alpha/message';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from '../stubs/user/v1alpha/service';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
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
