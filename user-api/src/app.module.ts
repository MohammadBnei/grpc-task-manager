import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './primsa.service';
import { UserModule } from './user/user.module';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './grpcOption';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        MYSQL_URL: Joi.string().required(),
        PORT: Joi.number(),
        insecure: Joi.boolean().required(),
        USER_CERT: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
        USER_KEY: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
        JAEGER_URL: Joi.string(),
        HEALTH_PORT: Joi.number(),
      }),
    }),
    GrpcReflectionModule.register(grpcOption()),
    UserModule,
    HealthModule,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
