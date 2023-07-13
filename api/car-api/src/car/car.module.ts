import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './entity/car.schema';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    AuthModule,
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
