# Implementing gRPC client in NestJS

gRPC is a high-performance and light-weight protocol to build distributed systems, and NestJS is a progressive Node.js framework for building efficient, scalable, and maintainable web applications. By integrating gRPC with NestJS, we can create microservices that can communicate with each other efficiently. In this tutorial, we will see how to implement a gRPC client in NestJS.

## Prerequisites

Before proceeding with the tutorial, we need to install the following:

- Node.js (v12 or higher)
- NestJS CLI (`npm i -g @nestjs/cli`)
- Finished [this tutorial](./Guided-Nestjs-gRPC.md)

## Step 1 - Create a NestJS module for UserService

First, we need to create a NestJS module for the UserService. This can be done using NestJS CLI by running:

```bash
$ nest g module user
```
This command will create a new module called "user" in the `src` directory.

Next, initialize a service in the user module :
```bash
$ nest g service user
```

You should see the `user.module.ts` updated with the service and the `app.module.ts` importing the user module.

## Step 2 - Create a gRPC client

To create a gRPC client in NestJS, we need to create a service that will communicate with the gRPC server. This service should implement the `OnModuleInit` interface to initialize the client connection.

Here is an example implementation of a gRPC client service:

```typescript
// Filename : user/user.service.ts
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
  UserServiceClient,
} from './stubs/user/v1alpha/service';
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
```

## Step 3 - Export UserService in the module

We need to export the `UserService` in the created user module so that we can inject it in other parts of the application. To do this, add the following code in the `user.module.ts` file:

```typescript
// Filename : user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CLIENT_GRPC_OPTIONS } from '@nestjs/microservices';

@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```


## Step 4 - Inject gRPC client options

You can see in the user service that we use the `@Inject(USER_SERVICE_NAME)`. This decorator tells nestjs to inject the dependency into our `client` variable. But this is not magic, we have to tell nest where to find this dependency !

This part will be about configuring the connection to the user api. Go to your `grpc.config.ts` file and add the following :
```typescript
export const userGrpcOptions: ClientProviderOptions = {
  return {
    name: USER_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: <USER_API_URL>,
      package: USER_V1ALPHA_PACKAGE_NAME,
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../proto/user/v1alpha/service.proto')],
      credentials: ChannelCredentials.createInsecure(),
    },
  };
};
```

The "name" option is what will be used by nest to resolve the dependency. Lastly, this grpc option needs to be passed to a `ClientModule`, which is nest abstraction for connection to external service.
Head back into `user.module.ts`, and add the following :
```typescript
// Filename : user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CLIENT_GRPC_OPTIONS } from '@nestjs/microservices';

@Module({
  import: [ClientModule.register([])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```
## Conclusion

This tutorial demonstrates how to implement a gRPC client in NestJS to communicate with a gRPC server. gRPC provides a fast, efficient, and secure mechanism for inter-service communication, and NestJS provides a flexible and scalable framework for developing Node.js applications. Combining these two technologies can help us build robust microservices-based architectures.