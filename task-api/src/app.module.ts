import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { UserusageModule } from './userusage/userusage.module';
import { ProfanityService } from './profanity/profanity.service';
import { ProfanityModule } from './profanity/profanity.module';
import { StreamsModule } from './streams/streams.module';
import * as Joi from 'joi';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './grpcOption';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        MONGO_URL: Joi.string().required(),
        PORT: Joi.string(),
        insecure: Joi.boolean().required(),
        TASK_CERT: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
        TASK_KEY: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    GrpcReflectionModule.register(grpcOption()),
    TaskModule,
    HealthModule,
    UserusageModule,
    ProfanityModule,
    StreamsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProfanityService],
})
export class AppModule {}
