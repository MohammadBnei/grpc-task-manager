import { Metadata } from '@grpc/grpc-js';
import { Inject, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  FindRequest,
  FindResponse,
  User,
} from 'src/stubs/user/v1alpha/message';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'src/stubs/user/v1alpha/service';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async findUser(req: FindRequest, md: Metadata): Promise<User> {
    const res: FindResponse = await firstValueFrom(
      this.userService.find(req, md),
    );

    return res.user?.[0];
  }
}
