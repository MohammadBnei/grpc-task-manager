import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { grpcConfig } from './grpc.config';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as Joi from 'joi';
import { grpcOption } from './grpcOption';
import { HealthModule } from './health/health.module';

const envSchema = Joi.object({
  MYSQL_URL: Joi.string().required(),
  PORT: Joi.number().default(4000),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: envSchema,
    }),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => grpcOption(cs),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
