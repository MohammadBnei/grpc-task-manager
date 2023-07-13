import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { RaceService } from './race.service';
import {
  AddFieldRequest,
  AddFieldResponse,
  RemoveFieldRequest,
  RemoveFieldResponse,
} from '../stubs/race/v1beta/request';
import { ProfanityService } from 'src/profanity/profanity.service';
import { StreamsService } from 'src/streams/streams.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('race')
export class FieldController {
  constructor(
    private raceService: RaceService,
    private profanityService: ProfanityService,
    private streams: StreamsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('FieldService')
  async AddField(request: AddFieldRequest): Promise<AddFieldResponse> {
    try {
      const { fieldName, fieldValue } = request;
      this.profanityService.checkStr(fieldName, fieldValue);

      const uRace = await this.raceService.addField(request.raceName, {
        name: request.fieldName,
        value: request.fieldValue,
        type: request.fieldType,
      });

      const pbRace = this.raceService.toRacePb(uRace);

      this.streams.raceStream$.next({
        eventType: 'update',
        race: pbRace,
      });

      return { race: pbRace };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('FieldService')
  async RemoveField(request: RemoveFieldRequest): Promise<RemoveFieldResponse> {
    try {
      const { fieldName, raceName } = request;

      const uRace = await this.raceService.deleteField(raceName, fieldName);

      const pbRace = this.raceService.toRacePb(uRace);

      this.streams.raceStream$.next({
        eventType: 'update',
        race: pbRace,
      });

      return { race: pbRace };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
