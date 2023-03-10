import { Module, RequestMethod } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './primsa.service';
import { UserModule } from './user/user.module';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './grpcOption';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { opentelemetryConfig } from './tracing';
import { LoggerModule } from 'nestjs-pino';

const envSchema = Joi.object({
  MYSQL_URL: Joi.string().required(),
  PORT: Joi.number().default(4000),
  HEALTH_PORT: Joi.number().default(3000),
  insecure: Joi.boolean().required(),
  USER_CERT: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  USER_KEY: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  ROOT_CA: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  JAEGER_URL: Joi.string(),
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
      exclude: [{ method: RequestMethod.ALL, path: 'health' }],
    }),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    UserModule,
    AuthModule,
    HealthModule,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
