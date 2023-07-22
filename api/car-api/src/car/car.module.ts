import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './entity/car.schema';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from '../stubs/user/v1alpha/service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { userGrpcOptions } from '../config/grpc.option';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_SERVICE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => userGrpcOptions(cs),
      },
    ]),
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    AuthModule,
    UserModule,
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
