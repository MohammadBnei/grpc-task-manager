import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './grpcOption';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import * as Joi from 'joi';

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
        USER_CERT: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
        USER_KEY: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
      }),
    }),
    GrpcReflectionModule.register(grpcOption()),
    ClientsModule.register([
      {
        name: 'user',
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_API_URL,
          package: 'user.v1alpha',
          loader: {
            includeDirs: [join(__dirname, 'proto')],
          },
          protoPath: [join(__dirname, 'proto/user/v1alpha/service.proto')],
        },
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
