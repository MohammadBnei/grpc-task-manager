import { Controller } from '@nestjs/common';
import {
  UsingRequest,
  UsingResponse,
  UsingStreamRequest,
  UsingStreamResponse,
} from '../stubs/race/v1beta/request';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { StreamsService } from 'src/streams/streams.service';

@Controller('userusage')
export class UserusageController {
  constructor(private streams: StreamsService) {}

  @GrpcMethod('UsageService')
  async Using(request: UsingRequest): Promise<UsingResponse> {
    const { username, raceName, eventType } = request;

    this.streams.usageStream$.next({
      username,
      raceName,
      eventType,
    });

    return {
      username,
      raceName,
      eventType,
    };
  }

  @GrpcMethod('UsageService')
  UsingStream(request: UsingStreamRequest): Observable<UsingStreamResponse> {
    try {
      return this.streams.usageStream$.asObservable();
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
