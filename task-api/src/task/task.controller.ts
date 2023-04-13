import { Controller, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { TaskService } from './task.service';
import {
  DeleteTaskRequest,
  CreateTaskRequest,
  GetTaskRequest,
  ListTasksRequest,
  ListTasksResponse,
  StreamTasksRequest,
  StreamTasksResponse,
  TaskResponse,
} from '../stubs/task/v1beta/task';
import { Observable } from 'rxjs';
import { ProfanityService } from 'src/profanity/profanity.service';
import { StreamsService } from 'src/streams/streams.service';
import { GrpcAuthGuard } from 'src/auth/auth.guard';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './entity/task.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private profanityService: ProfanityService,
    private streams: StreamsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('TaskService')
  async GetTask(request: GetTaskRequest): Promise<TaskResponse> {
    const name = request.name;

    try {
      const task = await this.taskService.find('', name);

      const pbTask = this.taskService.toTaskPb(task);

      return { task: pbTask };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  async ListTasks(request: ListTasksRequest): Promise<ListTasksResponse> {
    try {
      const tasks = await this.taskService.findAll();

      const listTasksResponse = ListTasksResponse.create({
        tasks: tasks.map(this.taskService.toTaskPb),
      });

      return listTasksResponse;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  // @UseGuards(GrpcAuthGuard)
  @GrpcMethod('TaskService')
  async CreateTask(request: CreateTaskRequest): Promise<TaskResponse> {
    try {
      await this.validateDto(request.task, CreateTaskDto);
      const nTask = {
        name: request.task.name,
        dueDate: new Date(request.task.dueDate),
      };
      if (!nTask.name)
        throw new RpcException({
          message: 'No name provided',
          code: HttpStatus.BAD_REQUEST,
          status: status.INVALID_ARGUMENT,
        });

      this.profanityService.checkTask(request.task);

      const task = await this.taskService.create(nTask);
      const pbTask = this.taskService.toTaskPb(task);

      this.streams.taskStream$.next({
        eventType: 'create',
        task: pbTask,
      });

      return { task: pbTask };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException((error as RpcException).message || error);
    }
  }

  // @GrpcMethod('TaskService')
  // async UpdateTask(request: UpdateTaskRequest): Promise<TaskResponse> {
  //   try {
  //     const nTask = {
  //       fields: request.task.fields,
  //       dueDate: new Date(request.task.dueDate),
  //     };

  //     this.profanityService.checkTask(request.task);

  //     const task = await this.taskService.updateTask(
  //       { name: request.task.name },
  //       nTask,
  //     );
  //     const pbTask = Task.create({
  //       name: task.name,
  //       fields: task.fieldsArray,
  //       dueDate: task.dueDate.toISOString(),
  //     });

  //     this.streams.taskStream$.next({
  //       eventType: 'update',
  //       task: pbTask,
  //     });

  //     return { task: pbTask };
  //   } catch (error) {
  // this.logger.error(error);

  //     throw new RpcException(error);
  //   }
  // }

  @GrpcMethod('TaskService')
  async DeleteTask(request: DeleteTaskRequest): Promise<TaskResponse> {
    try {
      const task = await this.taskService.deleteTask(request.name);
      const pbTask = this.taskService.toTaskPb(task);

      this.streams.taskStream$.next({
        eventType: 'delete',
        task: pbTask,
      });

      return { task: pbTask };
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  StreamTasks(request: StreamTasksRequest): Observable<StreamTasksResponse> {
    try {
      return this.streams.taskStream$.asObservable();
    } catch (error) {
      this.logger.error(error);

      throw new RpcException(error);
    }
  }

  private async validateDto(data: any, Dto: any) {
    const dto = plainToInstance(Dto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: errors
          .map(
            ({ value, property, constraints }) =>
              `${value} is not a valid ${property} value (${Object.values(
                constraints,
              ).join(', ')})`,
          )
          .join('\n'),
      });
    }
  }
}
