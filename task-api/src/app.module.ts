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
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        MONGO_URL: Joi.string().required(),
        PORT: Joi.string(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    GrpcReflectionModule.register(grpcOption()),
    TaskModule,
    UserusageModule,
    ProfanityModule,
    StreamsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProfanityService],
})
export class AppModule {}
