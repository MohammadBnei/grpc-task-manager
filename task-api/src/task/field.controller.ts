import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { TaskService } from './task.service';
import {
  AddFieldRequest,
  TaskResponse,
  RemoveFieldRequest,
} from '../stubs/task/v1beta/task';
import { ProfanityService } from 'src/profanity/profanity.service';
import { StreamsService } from 'src/streams/streams.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('task')
export class FieldController {
  constructor(
    private taskService: TaskService,
    private profanityService: ProfanityService,
    private streams: StreamsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('FieldService')
  async AddField(request: AddFieldRequest): Promise<TaskResponse> {
    try {
      const { fieldName, fieldValue } = request;
      this.profanityService.checkStr(fieldName, fieldValue);

      const uTask = await this.taskService.addField(request.taskName, {
        name: request.fieldName,
        value: request.fieldValue,
        type: request.fieldType,
      });

      const pbTask = this.taskService.toTaskPb(uTask);

      this.streams.taskStream$.next({
        eventType: 'update',
        task: pbTask,
      });

      return { task: pbTask };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('FieldService')
  async RemoveField(request: RemoveFieldRequest): Promise<TaskResponse> {
    try {
      const { fieldName, taskName } = request;

      const uTask = await this.taskService.deleteField(taskName, fieldName);

      const pbTask = this.taskService.toTaskPb(uTask);

      this.streams.taskStream$.next({
        eventType: 'update',
        task: pbTask,
      });

      return { task: pbTask };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
