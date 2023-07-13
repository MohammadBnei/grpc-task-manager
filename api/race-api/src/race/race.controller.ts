import { Controller, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RaceService } from './race.service';
import {
  DeleteRaceRequest,
  CreateRaceRequest,
  GetRaceRequest,
  ListRacesResponse,
  GetRaceResponse,
  CreateRaceResponse,
  DeleteRaceResponse,
  UpdateRaceRequest,
  UpdateRaceResponse,
} from '../stubs/race/request';
import { GrpcAuthGuard } from 'src/auth/auth.guard';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRaceDto } from './entity/race.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('race')
export class RaceController {
  constructor(
    private raceService: RaceService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('RaceService')
  async GetRace(request: GetRaceRequest): Promise<GetRaceResponse> {
    try {
      const race = await this.raceService.find(request.id, request.name);

      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RaceService')
  async ListRaces(): Promise<ListRacesResponse> {
    try {
      const races = await this.raceService.findAll();

      return { races: races.map(this.raceService.toRacePb), nextPageToken: '' };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('RaceService')
  async CreateRace(request: CreateRaceRequest): Promise<CreateRaceResponse> {
    try {
      await this.validateDto(request, CreateRaceDto);
      const nRace = {
        name: request.name,
        date: new Date(request.date),
      };

      const race = await this.raceService.create(nRace);
      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RaceService')
  async UpdateRace(request: UpdateRaceRequest): Promise<UpdateRaceResponse> {
    try {
      const nRace = {
        name: request.name,
        date: new Date(request.date),
      };

      const race = await this.raceService.updateRace({ id: request.id }, nRace);
      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  @GrpcMethod('RaceService')
  async DeleteRace(request: DeleteRaceRequest): Promise<DeleteRaceResponse> {
    try {
      const race = await this.raceService.deleteRace(request.id);
      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
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
