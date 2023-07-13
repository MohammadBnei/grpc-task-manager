import { Controller, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RaceService } from './race.service';
import {
  DeleteRaceRequest,
  CreateRaceRequest,
  GetRaceRequest,
  ListRacesRequest,
  ListRacesResponse,
  StreamRacesRequest,
  StreamRacesResponse,
  GetRaceResponse,
  CreateRaceResponse,
  DeleteRaceResponse,
} from '../stubs/race/v1beta/request';
import { Observable } from 'rxjs';
import { ProfanityService } from 'src/profanity/profanity.service';
import { StreamsService } from 'src/streams/streams.service';
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
    private profanityService: ProfanityService,
    private streams: StreamsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('RaceService')
  async GetRace(request: GetRaceRequest): Promise<GetRaceResponse> {
    const name = request.name;

    try {
      const race = await this.raceService.find('', name);

      const pbRace = this.raceService.toRacePb(race);

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RaceService')
  async ListRaces(request: ListRacesRequest): Promise<ListRacesResponse> {
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
      await this.validateDto(request.race, CreateRaceDto);
      const nRace = {
        name: request.race.name,
        dueDate: new Date(request.race.dueDate),
      };
      if (!nRace.name)
        throw new RpcException({
          message: 'No name provided',
          code: HttpStatus.BAD_REQUEST,
          status: status.INVALID_ARGUMENT,
        });

      this.profanityService.checkRace(request.race);

      const race = await this.raceService.create(nRace);
      const pbRace = this.raceService.toRacePb(race);

      this.streams.raceStream$.next({
        eventType: 'create',
        race: pbRace,
      });

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  // @GrpcMethod('RaceService')
  // async UpdateRace(request: UpdateRaceRequest): Promise<RaceResponse> {
  //   try {
  //     const nRace = {
  //       fields: request.race.fields,
  //       dueDate: new Date(request.race.dueDate),
  //     };

  //     this.profanityService.checkRace(request.race);

  //     const race = await this.raceService.updateRace(
  //       { name: request.race.name },
  //       nRace,
  //     );
  //     const pbRace = Race.create({
  //       name: race.name,
  //       fields: race.fieldsArray,
  //       dueDate: race.dueDate.toISOString(),
  //     });

  //     this.streams.raceStream$.next({
  //       eventType: 'update',
  //       race: pbRace,
  //     });

  //     return { race: pbRace };
  //   } catch (error) {
  // this.logger.error(error);

  //     throw new RpcException(error);
  //   }
  // }

  @GrpcMethod('RaceService')
  async DeleteRace(request: DeleteRaceRequest): Promise<DeleteRaceResponse> {
    try {
      const race = await this.raceService.deleteRace(request.name);
      const pbRace = this.raceService.toRacePb(race);

      this.streams.raceStream$.next({
        eventType: 'delete',
        race: pbRace,
      });

      return { race: pbRace };
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  @GrpcMethod('RaceService')
  StreamRaces(request: StreamRacesRequest): Observable<StreamRacesResponse> {
    try {
      return this.streams.raceStream$.asObservable();
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
