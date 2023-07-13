import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './entity/car.schema';
import { Car as CarPb } from '../stubs/car/message';
import { CreateCarDto, UpdateCarDto } from './entity/car.dto';

@Injectable()
export class CarService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  toCarPb(car: Partial<CarDocument>): CarPb {
    return {
      carId: car.id,
      driverId: car.driver_id,
      brand: car.brand,
      model: car.model,
    };
  }

  async create(createCarDto: CreateCarDto): Promise<Car> {
    try {
      const createdCar = new this.carModel(createCarDto);
      return await createdCar.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec();
  }

  async find(id: string | number) {
    const car = await this.carModel.findOne({ id });

    if (!car) {
      throw new Error(`car with id ${id} not found`);
    }

    return car;
  }

  async updateCar(
    id: number,
    driver_id: number,
    car: UpdateCarDto,
  ): Promise<Car> {
    const carUpdated = await this.carModel.findOneAndUpdate(
      { id, driver_id },
      car,
    );

    if (!carUpdated) {
      throw new Error(`car with name ${carUpdated.id} not found`);
    }

    return carUpdated;
  }

  async deleteCar(id: number, driver_id: number) {
    const car = await this.carModel.findOneAndDelete({ id, driver_id });

    if (!car) {
      throw new Error(`car with name ${id} not found`);
    }

    return car;
  }
}
