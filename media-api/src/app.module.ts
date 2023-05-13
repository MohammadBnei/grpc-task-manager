import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { opentelemetryConfig } from './tracing';
import Joi from 'joi';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import grpcOption from './grpcOption';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { MediaModule } from './media/media.module';
import { MongooseModule } from '@nestjs/mongoose';

const envSchema = Joi.object({
  MONGO_URL: Joi.string().required(),
  PORT: Joi.string().default(4000),
  HEALTH_PORT: Joi.number().default(3000),
  insecure: Joi.boolean().required(),
  JAEGER_URL: Joi.string().required(),
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
    MongooseModule.forRoot(process.env.MONGO_URL),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
