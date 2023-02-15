import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { TaskService } from './task.service';
import {
  Task,
  AddFieldRequest,
  TaskResponse,
  RemoveFieldRequest,
} from '../stubs/task/v1beta/task';
import { ProfanityService } from 'src/profanity/profanity.service';
import { StreamsService } from 'src/streams/streams.service';

@Controller('task')
export class FieldController {
  constructor(
    private taskService: TaskService,
    private profanityService: ProfanityService,
    private streams: StreamsService,
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

      const pbTask = Task.create({
        name: uTask.name,
        fields: uTask.fieldsArray,
        dueDate: uTask.dueDate.toISOString(),
      });

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

      const pbTask = Task.create({
        name: uTask.name,
        fields: uTask.fieldsArray,
        dueDate: uTask.dueDate.toISOString(),
      });

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
