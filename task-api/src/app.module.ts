import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { UserusageModule } from './userusage/userusage.module';
import { ProfanityService } from './profanity/profanity.service';
import { ProfanityModule } from './profanity/profanity.module';
import { StreamsModule } from './streams/streams.module';
import * as Joi from 'joi';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './grpcOption';
import { HealthModule } from './health/health.module';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { opentelemetryConfig } from './tracing';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';

const envSchema = Joi.object({
  MONGO_URL: Joi.string().required(),
  PORT: Joi.string().default(4002),
  HEALTH_PORT: Joi.number().default(3000),
  insecure: Joi.boolean().required(),
  TASK_CERT: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  TASK_KEY: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  ROOT_CA: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  JAEGER_URL: Joi.string().required(),
  AUTH_API_URL: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: envSchema,
      isGlobal: true,
    }),
    OpenTelemetryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => opentelemetryConfig(cs),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'auth-api',
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    TaskModule,
    AuthModule,
    HealthModule,
    UserusageModule,
    ProfanityModule,
    StreamsModule,
  ],
  providers: [ProfanityService],
})
export class AppModule {}
