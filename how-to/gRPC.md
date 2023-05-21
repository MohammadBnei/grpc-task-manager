# gRPC 

## Introduction

gRPC is a high-performance, open-source remote procedure call (RPC) framework developed by Google. It allows client and server applications to communicate transparently, making it easier to build distributed systems that can scale and handle large amounts of data. In this article, we will explore how to use gRPC with NestJS.

## Differences with REST

The main difference between gRPC and REST is that REST is an architectural style, while gRPC is a framework. REST is based on the concept of resources and HTTP verbs, while gRPC is based on the idea of a remote procedure call.

In gRPC, the client and server applications define the methods that they want to communicate with using a protocol buffer interface definition language (IDL). This IDL is then compiled into code for various programming languages, which can be used to implement the client and server applications.

One of the key advantages of gRPC over REST is that it uses binary encoding instead of text-based encoding, making it faster and more efficient. It also supports streaming, which allows for real-time communication between the client and server.

Another advantage of gRPC is that it supports multiple programming languages, making it easier to build distributed systems that use different languages for different parts of the application.

Overall, gRPC is a modern and efficient framework for building distributed systems, offering advantages over REST in terms of speed, efficiency, and language support.

## Protobuf

Protocol Buffers (protobuf) is a language-agnostic binary serialization format used by gRPC. It allows for efficient and flexible communication between different programming languages and platforms in a standardized way. The protobuf format also enables versioning of the API, making it easier to update APIs without breaking backward compatibility.

Through a protobuf interface definition language (IDL), developers can define the structure and parameters of API messages and methods to be used by the client and server applications. To use protobuf with NestJS, we need to install the `@grpc/grpc-js` and `@grpc/proto-loader` package:

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

We can then define the protobuf messages and methods using the IDL. Here is an example of a `hello.proto` file:

```protobuf
syntax = "proto3";

package hello;

message HelloRequest {
  string name = 1;
}

message HelloResponse {
  string message = 1;
}

service HelloService {
  rpc SayHello (HelloRequest) returns (HelloResponse);
}
```

We can then compile the `hello.proto` file into TypeScript code. See [here](./GenerateProto.md).

## gRPC Server

To use gRPC with NestJS, we need to install the `@nestjs/microservices` package:

```bash
npm install @nestjs/microservices 
```

NestJS requires the protobuf file to be loaded into the api. Put the `hello.proto` in a src/proto folder.

To implement the gRPC server with NestJS, we need to create a microservice using the `@nestjs/microservices` package. Here is an example of a `main.ts` file:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: 'hello',
      protoPath: join(__dirname, 'proto/hello.proto'),
    },
  });
  await app.listen();
}

bootstrap();
```

In this example, we import the `MicroserviceOptions` and `Transport` classes from `@nestjs/microservices`. We also import the `join` function from Node.js' `path` module, to resolve the path of the `hello.proto` file.

We create the microservice using `NestFactory.createMicroservice`, passing the `AppModule` and the `MicroserviceOptions` object. We set the transport to `Transport.GRPC`, and define the URL, package name, and path of the `hello.proto` file.

We then call `app.listen()` to start the server.

**Important**
You need to add an option to `nest-cli.json` for the Nest CLI to incorporate proto file in the dist directory (used for starting the api).
```json
{
  "compilerOptions": {
    "assets": ["**/*.proto"],
    "watchAssets": true
  }
}
```

Lastly, we need to implement the core of our gRPC service. In `app.controller.ts`, add the following implementation :
```ts
@Controller()
export class HeroesController {
  @GrpcMethod('HelloService', 'SayHello')
  sayHello(data: HelloRequest, metadata: Metadata, call: ServerUnaryCall<any, any>): HelloResponse {
    return `hello ${data.name}`;
  }
}
```

## Conclusion

gRPC is a powerful framework for building distributed systems, offering advantages over REST in terms of speed, efficiency, and language support. In this article, we explored how to use gRPC with NestJS, and how to implement the gRPC server using the generated code from the protobuf IDL.