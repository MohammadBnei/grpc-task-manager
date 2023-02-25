import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { StreamTasksResponse, UsageResponse } from 'src/stubs/task/v1beta/task';

@Injectable()
export class StreamsService {
  taskStream$: Subject<StreamTasksResponse>;
  usageStream$: Subject<UsageResponse>;
  constructor() {
    this.taskStream$ = new Subject<StreamTasksResponse>();
    this.usageStream$ = new Subject<UsageResponse>();
  }
}
