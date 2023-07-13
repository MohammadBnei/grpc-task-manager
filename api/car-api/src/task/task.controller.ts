import { Controller, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { CarService } from './car.service';
import {
  DeleteCarRequest,
  CreateCarRequest,
  GetCarRequest,
  ListCarsRequest,
  ListCarsResponse,
  StreamCarsRequest,
  StreamCarsResponse,
  GetCarResponse,
  CreateCarResponse,
  DeleteCarResponse,
} from '../stubs/car/v1beta/request';
import { Observable } from 'rxjs';
import { ProfanityService } from 'src/profanity/profanity.service';
import { StreamsService } from 'src/streams/streams.service';
import { GrpcAuthGuard } from 'src/auth/auth.guard';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCarDto } from './entity/car.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('car')
export class CarController {
  constructor(
    private carService: CarService,
    private profanityService: ProfanityService,
    private streams: StreamsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('CarService')
  async GetCar(request: GetCarRequest): Promise<GetCarResponse> {
    const name = request.name;

    try {
      const car = await this.carService.find('', name);

      const pbCar = this.carService.toCarPb(car);

      return { car: pbCar };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('CarService')
  async ListCars(request: ListCarsRequest): Promise<ListCarsResponse> {
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
  async CreateCar(request: CreateCarRequest): Promise<CreateCarResponse> {
    try {
      await this.validateDto(request.car, CreateCarDto);
      const nCar = {
        name: request.car.name,
        dueDate: new Date(request.car.dueDate),
      };
      if (!nCar.name)
        throw new RpcException({
          message: 'No name provided',
          code: HttpStatus.BAD_REQUEST,
          status: status.INVALID_ARGUMENT,
        });

      this.profanityService.checkCar(request.car);

      const car = await this.carService.create(nCar);
      const pbCar = this.carService.toCarPb(car);

      this.streams.carStream$.next({
        eventType: 'create',
        car: pbCar,
      });

      return { car: pbCar };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  // @GrpcMethod('CarService')
  // async UpdateCar(request: UpdateCarRequest): Promise<CarResponse> {
  //   try {
  //     const nCar = {
  //       fields: request.car.fields,
  //       dueDate: new Date(request.car.dueDate),
  //     };

  //     this.profanityService.checkCar(request.car);

  //     const car = await this.carService.updateCar(
  //       { name: request.car.name },
  //       nCar,
  //     );
  //     const pbCar = Car.create({
  //       name: car.name,
  //       fields: car.fieldsArray,
  //       dueDate: car.dueDate.toISOString(),
  //     });

  //     this.streams.carStream$.next({
  //       eventType: 'update',
  //       car: pbCar,
  //     });

  //     return { car: pbCar };
  //   } catch (error) {
  // this.logger.error(error);

  //     throw new RpcException(error);
  //   }
  // }

  @GrpcMethod('CarService')
  async DeleteCar(request: DeleteCarRequest): Promise<DeleteCarResponse> {
    try {
      const car = await this.carService.deleteCar(request.name);
      const pbCar = this.carService.toCarPb(car);

      this.streams.carStream$.next({
        eventType: 'delete',
        car: pbCar,
      });

      return { car: pbCar };
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  @GrpcMethod('CarService')
  StreamCars(request: StreamCarsRequest): Observable<StreamCarsResponse> {
    try {
      return this.streams.carStream$.asObservable();
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
