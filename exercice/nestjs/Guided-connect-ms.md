# Implementing gRPC client in NestJS

gRPC is a high-performance and light-weight protocol to build distributed systems, and NestJS is a progressive Node.js framework for building efficient, scalable, and maintainable web applications. By integrating gRPC with NestJS, we can create microservices that can communicate with each other efficiently. In this tutorial, we will see how to implement a gRPC client in NestJS.

## Prerequisites

Before proceeding with the tutorial, we need to install the following:

- Node.js (v12 or higher)
- NestJS CLI (`npm i -g @nestjs/cli`)
- Finished [this tutorial](./Guided-Nestjs-gRPC.md)

## Step 1 - Create a gRPC client

To create a gRPC client in NestJS, we need to create a service that will communicate with the gRPC server. This service should implement the `OnModuleInit` interface to initialize the client connection.

Here is an example implementation of a gRPC client service:

```typescript
// Filename : app.service.ts
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

  async findUser(req: FindRequest, md: Record<string, any>): Promise<User> {
    const meta = new Metadata();
    Object.entries(md).map(([k, v]) => meta.add(k, v));
    const res: FindResponse = await firstValueFrom(
      this.userService.find(req, meta) as any,
    );

    return res.user?.[0];
  }
}
```

## Step 4 - Inject gRPC client service

Once we have created the gRPC client service, we can inject it into any module or controller in our NestJS application.

Here is an example of injecting the `AppService` service into a controller:

```typescript
// Filename : app.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async checkPassword(
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    return this.appService.checkPassword(email, password);
  }

  @Get('/user')
  async getUser(@Query() dto: any) {
    const user = await this.appService.findUser(dto, {});
    return { user };
  }
}
```

## Conclusion

This tutorial demonstrates how to implement a gRPC client in NestJS to communicate with a gRPC server. gRPC provides a fast, efficient, and secure mechanism for inter-service communication, and NestJS provides a flexible and scalable framework for developing Node.js applications. Combining these two technologies can help us build robust microservices-based architectures.