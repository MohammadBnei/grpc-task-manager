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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import Joi from 'joi';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { opentelemetryConfig } from './tracing';
import { LoggerModule } from 'nestjs-pino';

const envSchema = Joi.object({
  MYSQL_URL: Joi.string().required(),
  PORT: Joi.number().default(4003),
  HEALTH_PORT: Joi.number().default(3002),
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
  JAEGER_URL: Joi.string().required(),
});
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: envSchema,
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
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => userGrpcOptions(cs),
      },
    ]),
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
