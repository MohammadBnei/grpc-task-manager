import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FieldsArray, Car, CarDocument } from './entity/car.schema';
import { CreateCarDto, UpdateCarDto } from './entity/car.dto';
import { Car as CarPb } from '../stubs/car/v1beta/message';
@Injectable()
export class CarService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  toCarPb(car: Partial<CarDocument>): CarPb {
    return {
      name: car.name,
      fields: car.fieldsArray,
      dueDate: car.dueDate.toISOString(),
      done: car.done,
      id: car._id.toString(),
    };
  }

  async create(createCarDto: CreateCarDto): Promise<Car> {
    try {
      const createdCar = new this.carModel(createCarDto);
      return await createdCar.save();
    } catch (error) {
      if ((error?.message as string)?.includes('E11000')) {
        throw new Error(`${createCarDto.name} name is taken`);
      }
    }
  }

  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec();
  }

  async find(id: string | number, name: string) {
    const car = await this.carModel.findOne({ id, name });

    if (!car) {
      throw new Error(`car with id ${id} or name ${name} not found`);
    }

    return car;
  }

  async addField(carName: string, ...fields: FieldsArray) {
    const car = await this.find('', carName);

    car.fieldsArray = fields;

    await car.save();

    return car;
  }

  async deleteField(carName: string, fieldName: string) {
    const car = await this.find('', carName);

    car.fields.delete(fieldName);

    await car.save();

    return car;
  }

  async updateCar(
    { id, name }: { name?: string; id?: string },
    uCar: UpdateCarDto,
  ): Promise<Car> {
    let car: CarDocument;
    if (id) {
      car = await this.carModel.findById(id);
    } else {
      car = await this.carModel.findOne({ name });
    }

    if (!car) {
      throw new Error(`car with id ${id} or name ${name} not found`);
    }

    Object.assign(car, uCar);

    await car.save();
    return car;
  }

  async deleteCar(id: number | string) {
    const car = await this.carModel.findOneAndDelete({
      name: { $regex: `^${id}$`, $options: 'i' },
    });

    if (!car) {
      throw new Error(`car with name ${id} not found`);
    }

    return car;
  }
}
