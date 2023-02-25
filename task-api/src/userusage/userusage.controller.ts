import { Controller } from '@nestjs/common';
import { UsageRequest, UsageResponse } from '../stubs/task/v1beta/task';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';
import { StreamsService } from 'src/streams/streams.service';

@Controller('userusage')
export class UserusageController {
  constructor(private streams: StreamsService) {}

  @GrpcMethod('UsageService')
  async Using(request: UsageRequest): Promise<UsageResponse> {
    const { username, taskName, eventType } = request;

    this.streams.usageStream$.next({
      username,
      taskName,
      eventType,
    });

    return {
      username,
      taskName,
      eventType,
    };
  }

  @GrpcMethod('UsageService')
  UsingStream(request: UsageRequest): Observable<UsageResponse> {
    try {
      return this.streams.usageStream$.asObservable();
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
