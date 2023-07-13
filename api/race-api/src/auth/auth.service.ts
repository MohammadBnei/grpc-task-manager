import { Inject, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ValidateResponse } from 'src/stubs/auth/v1alpha/message';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  AUTH_V1ALPHA_PACKAGE_NAME,
} from 'src/stubs/auth/v1alpha/service';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async validate(jwt: string): Promise<ValidateResponse> {
    const res: ValidateResponse = await firstValueFrom(
      this.authService.validate({
        jwt,
      }) as any,
    );

    return res;
  }
}
