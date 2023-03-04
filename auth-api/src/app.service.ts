import { OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CheckPasswordResponse,
  FindRequest,
  FindResponse,
  User,
} from './stubs/user/v1alpha/message';
import { UserServiceClient } from './stubs/user/v1alpha/service.client';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject('user') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
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

  async findUser(req: FindRequest): Promise<User> {
    const res: FindResponse = await firstValueFrom(
      this.userService.find(req) as any,
    );

    return res.user?.[0];
  }
}
