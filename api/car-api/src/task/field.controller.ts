import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CarService } from './car.service';
import {
  AddFieldRequest,
  AddFieldResponse,
  RemoveFieldRequest,
  RemoveFieldResponse,
} from '../stubs/car/v1beta/request';
import { ProfanityService } from 'src/profanity/profanity.service';
import { StreamsService } from 'src/streams/streams.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('car')
export class FieldController {
  constructor(
    private carService: CarService,
    private profanityService: ProfanityService,
    private streams: StreamsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('FieldService')
  async AddField(request: AddFieldRequest): Promise<AddFieldResponse> {
    try {
      const { fieldName, fieldValue } = request;
      this.profanityService.checkStr(fieldName, fieldValue);

      const uCar = await this.carService.addField(request.carName, {
        name: request.fieldName,
        value: request.fieldValue,
        type: request.fieldType,
      });

      const pbCar = this.carService.toCarPb(uCar);

      this.streams.carStream$.next({
        eventType: 'update',
        car: pbCar,
      });

      return { car: pbCar };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('FieldService')
  async RemoveField(request: RemoveFieldRequest): Promise<RemoveFieldResponse> {
    try {
      const { fieldName, carName } = request;

      const uCar = await this.carService.deleteField(carName, fieldName);

      const pbCar = this.carService.toCarPb(uCar);

      this.streams.carStream$.next({
        eventType: 'update',
        car: pbCar,
      });

      return { car: pbCar };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
