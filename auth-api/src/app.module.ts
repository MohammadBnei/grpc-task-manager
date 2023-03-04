import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption, { userGrpcOptions } from './grpcOption';
import { ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import * as Joi from 'joi';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { opentelemetryConfig } from './tracing';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        MYSQL_URL: Joi.string().required(),
        PORT: Joi.number(),
        USER_API_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        insecure: Joi.boolean().required(),
        AUTH_CERT: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
        AUTH_KEY: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
        ROOT_CA: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
        HEALTH_PORT: Joi.number(),
        JAEGER_URL: Joi.string().required(),
        METRICS_HOST: Joi.string().required(),
        METRICS_PORT: Joi.number().required(),
      }),
    }),
    OpenTelemetryModule.forRoot(opentelemetryConfig()),
    GrpcReflectionModule.register(grpcOption()),
    ClientsModule.register([userGrpcOptions()]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
    RefreshTokenModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RefreshTokenService, PrismaService],
})
export class AppModule {}
