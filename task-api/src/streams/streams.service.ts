import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import {
  StreamTasksResponse,
  UsingStreamResponse,
} from 'src/stubs/task/v1beta/request';

@Injectable()
export class StreamsService {
  taskStream$: Subject<StreamTasksResponse>;
  usageStream$: Subject<UsingStreamResponse>;
  constructor() {
    this.taskStream$ = new Subject<StreamTasksResponse>();
    this.usageStream$ = new Subject<UsingStreamResponse>();
  }
}
