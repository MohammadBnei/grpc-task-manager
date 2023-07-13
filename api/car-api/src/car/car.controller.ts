import { Controller, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { CarService } from './car.service';
import {
  DeleteCarRequest,
  CreateCarRequest,
  GetCarRequest,
  ListCarsResponse,
  GetCarResponse,
  CreateCarResponse,
  DeleteCarResponse,
  UpdateCarRequest,
  UpdateCarResponse,
} from '../stubs/car/request';
import { GrpcAuthGuard } from 'src/auth/auth.guard';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateCarDto, UpdateCarDto } from './entity/car.dto';
import { GRPCUser } from 'src/auth/user.decorator';

@Controller('car')
export class CarController {
  constructor(
    private carService: CarService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('CarService')
  async GetCar(request: GetCarRequest): Promise<GetCarResponse> {
    try {
      const car = await this.carService.find(request.id);

      const pbCar = this.carService.toCarPb(car);

      return { car: pbCar };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('CarService')
  async ListCars(): Promise<ListCarsResponse> {
    try {
      const cars = await this.carService.findAll();

      return { cars: cars.map(this.carService.toCarPb), nextPageToken: '' };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('CarService')
  async CreateCar(
    request: CreateCarRequest,
    @GRPCUser() user,
  ): Promise<CreateCarResponse> {
    try {
      await this.validateDto(request.car, CreateCarDto);

      const nCar = {
        driverId: user.id,
        brand: request.car.brand,
        model: request.car.model,
      };

      const car = await this.carService.create(nCar);
      const pbCar = this.carService.toCarPb(car);

      return { car: pbCar };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('CarService')
  async UpdateCar(
    request: UpdateCarRequest,
    @GRPCUser() user,
  ): Promise<UpdateCarResponse> {
    try {
      await this.validateDto(request.car, UpdateCarDto);

      const nCar = {
        brand: request.car.brand,
        model: request.car.model,
      };

      const car = await this.carService.updateCar(request.carId, user.id, nCar);
      const pbCar = this.carService.toCarPb(car);

      return { car: pbCar };
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  @GrpcMethod('CarService')
  async DeleteCar(
    request: DeleteCarRequest,
    @GRPCUser() user,
  ): Promise<DeleteCarResponse> {
    try {
      const car = await this.carService.deleteCar(request.id, user.id);
      const pbCar = this.carService.toCarPb(car);

      return { car: pbCar };
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  private async validateDto(data: any, Dto: any) {
    if (!data) {
      throw new RpcException({
        message: 'No data provided',
        code: status.INVALID_ARGUMENT,
      });
    }
    const dto = plainToInstance(Dto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: errors
          .map(
            ({ value, property, constraints }) =>
              `${value} is not a valid ${property} value (${Object.values(
                constraints,
              ).join(', ')})`,
          )
          .join('\n'),
      });
    }
  }
}
