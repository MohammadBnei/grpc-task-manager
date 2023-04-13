import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption, { authGrpcOption } from './grpc.option';
import { ClientsModule } from '@nestjs/microservices';

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(6000),
  DATABASE_URL: Joi.string().required(),
  AUTH_URL: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    GrpcReflectionModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: (cs: ConfigService) => authGrpcOption(cs),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
