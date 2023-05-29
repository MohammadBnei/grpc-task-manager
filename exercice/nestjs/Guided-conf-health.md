# Guided NestJS Conf & Health

## Prerequisites

- Finished [this tutorial](https://bnei.dev/microservices/2-connect-ms)
- Node.js (v18)
- NestJS CLI (`npm i -g @nestjs/cli`)

## Sommaire
1. [12-factor app](https://12factor.net/)
2. Configuration
4. Health Check

## Configuration
Storing configuration in the environment of an API is extremely useful in a microservices architecture for several reasons:

1. Scalability: When deploying a large number of microservices, having a central configuration management system may become difficult to scale. By storing configuration in the environment of each API, it becomes easy to scale independently without affecting other services.

2. Consistency: When configuration is stored in the environment, it ensures that the configuration is consistent across all instances of the service. Developers can easily update the configuration by simply changing the environment variables of the API.

3. Security: Storing configuration in the environment reduces security risks because it eliminates the need to store sensitive configuration data in code or configuration files. Environment variables can be securely managed and encrypted by the cloud provider.

4. DevOps: It allows DevOps to easily manage and deploy microservices independently without needing to coordinate with developers to update configuration files.

Overall, storing configuration in the environment of an API simplifies the management of microservices, reduces the risk of configuration errors, and allows for better scalability and security.

It's essential to detect configuration errors early in the startup process to prevent unexpected errors, downtime, and cascading failures. Stopping an API immediately after a configuration failure can help ensure consistency across the entire system and prevent inconsistencies caused by incorrect configuration. Therefore, stopping a microservices API early when configuration fails is a crucial concept to consider in building a reliable and resilient architecture.

Let's see how to handle configuration in a NestJS API. [NestJS Documentation](https://docs.nestjs.com/techniques/configuration#configuration)

### Setup

First, install the config package:

```bash
$ npm i --save @nestjs/config
```

Then, go to your `app.module.ts` and add the following to the import section:

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
	    ConfigModule.forRoot(),
	    // Other modules
	],
	// ...
})
```

Now, your API is able to read the variables from the environment but also from a `.env` file. Note that the environment takes precedence if the same variable is set in both. 
Also, it is important that the config module be loaded before anything else.

Some env variables are necessary for the API to function, while others are optional. We can define the rules with the `joi` package, so let's install it:

```bash
$ npm install --save joi
```

We can now set our rules. In `config/env.ts`, add the **Joi** schema validation:

```typescript
import * as Joi from 'joi';

export const envSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number().default(4000),
});
```

The import of Joi is like `import * as Joi from 'joi';` because the `esModuleInterop` is set to false by default. If set to true, modify this line with `import Joi from 'joi';`

We want to have a string for the database URL set before starting our app, and we want the default port to be 4000. Let's tell our **configModule** to use this schema, so head back to `app.module.ts` and add the following:

```typescript
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env'

@Module({
	imports: [
	    ConfigModule.forRoot({
	      ignoreEnvFile: process.env.NODE_ENV === 'production',
	      validationSchema: envSchema,
	    }),
	    // Other modules
	],
	// ...
})
```

SO, we ignore the `.env` in production and we validate our env variables before anything else. Let's test this. Remove the DATABASE_URL from your `.env` if you have one, and start your API. You should see the following:

```bash
$ npm start
// blabla error
Error: Config validation error: "DATABASE_URL" is required
```

### Usage

To use our configuration with the default and the required values, we need to inject the `ConfigService`. There is multiple way to inject it depending on where you are (`main.ts`, `provider`, `function`...). Let's start with our `port`. 

Go to your `grpc.option.ts`. We'll need to inject the config service and use it to get the port:

```typescript
import { ConfigService } from '@nestjs/config';

export const grpcConfig = (cs: ConfigService): GrpcOptions => 
	addReflectionToGrpcConfig({
	  transport: Transport.GRPC,
	  options: {
	    url: `0.0.0.0:${cs.get<number>(PORT)}`,
	    package: HERO_V1ALPHA_PACKAGE_NAME,
	    protoPath: join(__dirname, 'proto/hero/v1alpha/hero.proto'),
	  },
	});
```

Since we updated a variable to a function, we have to update accordingly our `main.ts` to fetch the config service and use it to compose our grpc options:

```typescript
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const cs = app.get(ConfigService);

	app.connectMicroservice(grpcConfig(cs));
	await app.startAllMicroservices();

	await app.listen(8888);
}
```

Don't worry about the 8888 port; we'll make use of it later for the health check URL.

Lastly, we have to modify the `app.module.ts` reflection module to use the config service:

```typescript
import { ConfigService } from '@nestjs/config';
import { envSchema } from './config/env'

@Module({
	imports: [
	    ConfigModule.forRoot({
	      ignoreEnvFile: process.env.NODE_ENV === 'production',
	      validationSchema: envSchema,
	    }),
		GrpcReflectionModule.registerAsync({
	      imports: [ConfigModule],
	      useFactory: (cs: ConfigService) => grpcConfig(cs),
	      inject: [ConfigService],
	    }),
	    // Other modules
	],
	// ...
})
```

This is the async register method; we can pass options to customize initialization of modules. This async registration method is common in NestJS modules.

---
### Exercise

Add a `USER_PORT` env variable of type string and required, then use it in the `grpc.option` for the `userGrpcOptions` variable. Modify the user service accordingly.

---

## Health Check

Health check endpoints are important for microservices architecture because they allow monitoring and alerting tools to continuously check the status of the service instance. It also helps in identifying failures or underperformance without having to monitor all possible endpoints. Health check endpoints provide valuable metrics about the service's state, such as the amount of memory used, uptime, active connections, CPU usage, etc., which in turn helps in detecting any issues with the service. It also helps to quickly detect and isolate issues that might be causing problems in a multi-service environment. This helps to facilitate quick remediation and ensure that the service is highly available, reliable, and performant.

Let's implement a basic health route in our NestJS API. [NestJS Documentation](https://docs.nestjs.com/recipes/terminus)

### Setup

Start by installing the necessary package:

```bash
$ npm install --save @nestjs/terminus 
```

Then, create a health module:

```bash
$ nest g module health
$ nest g controller health
```

In the `health/health.module.ts`, import `terminus`:

```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
	imports: [TerminusModule]
})
export class HealthModule {}
```

And in the controller, add the basic terminus structure:

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
	) {}
	
	@Get()
	@HealthCheck()
	check() {
		return this.health.check([/** We'll put here the list of health checks **/]);
	}
}
```

---
### Exercise

Look at the NestJS documentation and implement the memory and disk health checks.

---

### Custom Health Indicator

For Prisma, we are going to create a custom health indicator. In a new file called `health/prisma.health.ts`, add the following:

```typescript
import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
	constructor(private readonly prismaService: PrismaService) {
		super();
	}
	
	async isHealthy(key: string): Promise<HealthIndicatorResult> {
		try {
			await this.prismaService.$queryRaw`SELECT 1`;
			return this.getStatus(key, true);
		} catch (e) {
			throw new HealthCheckError('Prisma check failed', e);
		}
	}
}
```

As you can see, this health check performs a basic `SELECT 1` query on our Prisma database to ensure that it is ready to be queried.

Let's add this check to our health controller:

```typescript
import { PrismaHealthIndicator } from './health.prisma';

// ...
	constructor(
		private health: HealthCheckService,
		private pHI: PrismaHealthIndicator,
	) {}
  
	@Get()
	@HealthCheck()
	check() {
		return this.health.check([() => this.pHI.isHealthy('prisma_health')]);
	}
// ...
```

Don't forget to update the `health/health.module.ts` file with the necessary provider:

```typescript
import { PrismaHealthIndicator } from './prisma.health';
import { PrismaService } from 'src/prisma.service';

@Module({
	imports: [TerminusModule],
	controllers: [HealthController],
	providers: [PrismaService, PrismaHealthIndicator],
})
export class HealthModule {}
```

And that's it! To test it out, start the app and curl the health route:

```bash
$ npm start
$ curl http://localhost:8888/health
```

## Conclusion

In this guided tutorial, we covered some important aspects of building a microservices architecture with NestJS. We started by discussing the 12-factor app methodology and the benefits of storing configuration in the environment. We saw how to handle configuration in a NestJS API, including setting up a Joi schema validation and using the ConfigService to access the configuration variables throughout the application.

Next, we explored the importance of health check endpoints in a microservices architecture and implemented a basic health route using the Terminus library. We also created a custom health indicator for Prisma and added it to our health check endpoint.

Overall, we covered some essential concepts and techniques for building scalable, reliable and secure microservices with NestJS. By following these practices, you can ensure that your microservices architecture is well-designed, efficient, and easy to maintain over the long term.