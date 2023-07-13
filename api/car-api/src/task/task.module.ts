import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './entity/car.schema';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { ProfanityService } from 'src/profanity/profanity.service';
import { FieldController } from './field.controller';
import { StreamsService } from 'src/streams/streams.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    AuthModule,
  ],
  providers: [CarService, ProfanityService, StreamsService],
  controllers: [CarController, FieldController],
})
export class CarModule {}
