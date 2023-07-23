import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './entity/car.schema';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    AuthModule,
    UserModule,
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
