import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import {
  StreamRacesResponse,
  UsingStreamResponse,
} from 'src/stubs/race/v1beta/request';

@Injectable()
export class StreamsService {
  raceStream$: Subject<StreamRacesResponse>;
  usageStream$: Subject<UsingStreamResponse>;
  constructor() {
    this.raceStream$ = new Subject<StreamRacesResponse>();
    this.usageStream$ = new Subject<UsingStreamResponse>();
  }
}
