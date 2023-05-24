# NestJS gRPC Tutorial

In this tutorial, we'll build a gRPC service in NestJS, implementing CRUD operations for a Hero entity.

## Prerequisites

- Node.js with npm installed.
- Basic understanding of NestJS, gRPC, and protobuf.

## Getting Started

We'll start by setting up a new NestJS project:

```bash
$ npx @nestjs/cli new nestjs-grpc-tutorial
$ cd nestjs-grpc-tutorial
```

Next, we'll add the gRPC and protobuf dependencies:

```bash
$ npm i @nestjs/microservices @grpc/grpc-js @grpc/proto-loader nestjs-grpc-reflection
```

## Hero Protobuf

Create a `hero/v1alpha/hero.proto` in the `/proto` folder at the root of the project. 

In this file, we will setup our interface for gRPC :
```protobuf
syntax = "proto3";

package hero.v1alpha;

message Hero {
  string name = 1;
  int32 id = 2;
  int32 power = 3;
  int32 hp = 4;
}

service HeroCRUDService {
  rpc Get (GetRequest) returns (GetResponse);
  rpc Add (AddRequest) returns (AddResponse);
  rpc Update (UpdateRequest) returns (UpdateResponse);
  rpc Delete (DeleteRequest) returns (DeleteResponse);
}

message GetRequest {
  string name = 1;
  int32 id = 2;
}

message GetResponse {
  repeated Hero heroes = 1;
}

message AddRequest {
  string name = 1;
  int32 power = 2;
}

message AddResponse {
  Hero hero = 1;
}
```

----

### Exercice

Add the rest of the messages (`UpdateRequest`, `UpdateResponse`, `DeleteRequest`, `DeleteResponse`)

----

Then, follow the steps [here](../how-to/GenerateProto.md) to generate the stubs and export the proto file in your api.

You should see a `stubs` and `proto` folder inside your `src` folder.

## Prisma

We'll also install the Prisma ORM for database management:

```bash
$ npm i prisma
$ npx prisma init
```

This command should create a `prisma` folder and a `.env`. In the `.env`, change the `DATABASE_URL` with the value `mysql://root:passwd@localhost:3306/hero`.

To start the database, run the following :
```sh
$ docker compose up -d mariadb
```

We'll use Prisma to define our Hero entity. Create a `prisma/schema.prisma` file with the following content:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["tracing"]
}

datasource db {
  provider = "mysql"
  url      = env("MYSQL_URL")
}

model Hero {
  id        Int    @id @default(autoincrement())
}
```

----
### Exercice

In the `prisma/schema.prisma` file, add to the `hero` model the fields that are in the `hero.proto` `Hero message`.

----

Finally, run `npx prisma migrate dev` to import the schema to the sql database and generate the prisma clients.


## Service Implementation

We'll start by creating a `PrismaService` that extends the generated `PrismaClient` class from `@prisma/client`. We'll use this to access the database and perform CRUD operations on the Hero entity.

```typescript
// Filename : prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

We'll create an `AppService` that injects the `PrismaService`. This service will have methods for each of the CRUD operations defined in the `.proto` file.

```typescript
// Filename : app.service.ts
import { Injectable } from '@nestjs/common';
import { Hero } from './stubs/hero/v1alpha/hero';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  create(data: Prisma.HeroCreateInput): Promise<Hero> {
    return this.prisma.hero.create({ data });
  }

  findAll(): Promise<Hero[]> {
    return this.prisma.hero.findMany();
  }

  delete(id: number): Promise<Hero> {
    return this.prisma.hero.delete({
      where: { id },
    });
  }
}
```

----
### Exercice

Implement the following function in the service :
- `findById(id: number): Promise<Hero>`
- `findByName(name: string): Promise<Hero>`
- `async update(id: number, data: Prisma.HeroUpdateInput): Promise<Hero>`
----


We'll create an `AppController` that implements the `HeroCRUDServiceController` interface defined in the `.proto` file. This controller will use the `AppService` to perform CRUD operations on Heroes.

```typescript
// Filename : app.controller.ts
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  HERO_CR_UD_SERVICE_NAME,
  Hero,
  HeroCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  HeroCRUDServiceControllerMethods,
} from './stubs/hero/v1alpha/hero';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@HeroCRUDServiceControllerMethods()
export class AppController implements HeroCRUDServiceController {
  constructor(private readonly appService: AppService) {}
  async get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> {
    let hero: Hero;
    let heroes: Hero[] = [];

    if (request.id) {
      hero = await this.appService.findById(request.id);
      return { heroes: [hero] };
    } else if (request.name) {
      hero = await this.appService.findByName(request.name);
      return { heroes: [hero] };
    } else {
      heroes = await this.appService.findAll();
      return { heroes };
    }
  }
  async update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> {}

  async delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> {}

  async add(request: AddRequest): Promise<AddResponse> {}
}
```

----
### Exercice
Implement the empty function :
- update
- delete
- add
----


## gRPC Configuration

We'll configure NestJS to start a new gRPC server and listen for incoming connections. We'll use the `GrpcOptions` interface from `@nestjs/microservices` to define the server configuration.

```typescript
// Filename : grpc.config.ts
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { HERO_V1ALPHA_PACKAGE_NAME } from './stubs/hero/v1alpha/hero';
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:6000',
    package: HERO_V1ALPHA_PACKAGE_NAME,
    protoPath: join(__dirname, 'proto/hero/v1alpha/hero.proto'),
  },
}) as GrpcOptions;
```

This options are mandatory in nestjs, while the grpc-reflection package is a helper for postman.

## Starting the gRPC Server

We'll start the gRPC server in the `main.ts` file using the `NestFactory.createMicroservice` method and passing it the `grpcConfig` we just defined.

```typescript
// Filename : main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcConfig } from './grpc.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcConfig,
  );

  await app.listen();
}
bootstrap();
```

## Adding gRPC Reflection

We can add gRPC reflection to our server to easily test our API with tools like `evans` and `bloomrpc`. We'll do this by importing and registering the `GrpcReflectionModule` from `nestjs-grpc-reflection`.

```typescript
// Filename : app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { grpcConfig } from './grpc.config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [GrpcReflectionModule.register(grpcConfig)],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
```

## Testing the API

We can now test our API using Postman.

## Conclusion

In this tutorial, we've seen how to build a gRPC service in NestJS using the `@nestjs/microservices` package, and how to use Prisma to manage our Hero database.