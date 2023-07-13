import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import {
  StreamCarsResponse,
  UsingStreamResponse,
} from 'src/stubs/car/v1beta/request';

@Injectable()
export class StreamsService {
  carStream$: Subject<StreamCarsResponse>;
  usageStream$: Subject<UsingStreamResponse>;
  constructor() {
    this.carStream$ = new Subject<StreamCarsResponse>();
    this.usageStream$ = new Subject<UsingStreamResponse>();
  }
}
