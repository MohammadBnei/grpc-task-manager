import { Controller } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsageRequest, UsageResponse } from '../task/stubs/task/v1alpha/task';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';

@Controller('userusage')
export class UserusageController {
  constructor(private eventEmitter: EventEmitter2) {}

  @GrpcMethod('UsageService')
  async Using(request: UsageRequest): Promise<UsageResponse> {
    const { username, taskName } = request;

    this.eventEmitter.emit('using', {
      username,
      taskName,
    });

    return {
      username,
      taskName,
    };
  }

  @GrpcMethod('UsageService')
  UsingStream(request: UsageRequest): Observable<UsageResponse> {
    try {
      const stream$ = new Subject<UsageResponse>();
      this.eventEmitter.on('using', (payload) => {
        if (payload.username && payload.taskName)
          stream$.next(UsageResponse.create(payload));
      });

      return stream$.asObservable();
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
