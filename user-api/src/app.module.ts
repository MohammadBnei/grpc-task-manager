import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './primsa.service';
import { UserModule } from './user/user.module';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './grpcOption';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MYSQL_URL: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    OpenTelemetryModule.forRoot({
      serviceName: 'user-api',
      spanProcessor: new SimpleSpanProcessor(
        new ZipkinExporter({
          url: 'localhost:9411',
        }),
      ) as any,
    }),
    GrpcReflectionModule.register(grpcOption()),
    UserModule,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
