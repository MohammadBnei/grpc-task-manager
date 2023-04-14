import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption, { userGrpcOptions } from './config/grpc.option';
import { ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import Joi from 'joi';
import { USER_V1ALPHA_PACKAGE_NAME } from './stubs/user/v1alpha/service';
import { WinstonModule } from 'nest-winston';
import winstonConfig from './config/winston.config';

const envSchema = Joi.object({
  MYSQL_URL: Joi.string().required(),
  PORT: Joi.number().default(4003),
  HEALTH_PORT: Joi.number().default(3000),
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
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => winstonConfig(cs),
    }),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    ClientsModule.registerAsync([
      {
        name: USER_V1ALPHA_PACKAGE_NAME,
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
