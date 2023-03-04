import { ExecutionContext, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ValidateResponse } from 'src/stubs/auth/v1alpha/message';
import { AuthServiceClient } from 'src/stubs/auth/v1alpha/service.client';
import { authGrpcOptions } from 'src/grpcOption';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthService implements OnModuleInit {
  @Client(authGrpcOptions())
  client: ClientGrpc;

  private authService: AuthServiceClient;

  constructor(private reflector: Reflector) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
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
