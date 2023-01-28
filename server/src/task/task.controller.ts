import { Controller, HttpStatus } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { TaskService } from './task.service';
import {
  DeleteTaskRequest,
  UpdateTaskRequest,
  CreateTaskRequest,
  GetTaskRequest,
  ListTasksRequest,
  ListTasksResponse,
  Task,
  StreamTasksRequest,
  StreamTasksResponse,
} from './stubs/task/v1alpha/task';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Controller('task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private eventEmitter: EventEmitter2,
  ) {}

  @GrpcMethod('TaskService')
  async GetTask(request: GetTaskRequest): Promise<Task> {
    const name = request.name;

    try {
      const task = await this.taskService.find('', name);

      const pbTask = Task.create({
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: task.dueDate.toISOString(),
      });

      return pbTask;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  @GrpcMethod('TaskService')
  async ListTasks(request: ListTasksRequest): Promise<ListTasksResponse> {
    try {
      const tasks = await this.taskService.findAll();

      const listTasksResponse = ListTasksResponse.create({
        tasks: tasks.map((t) =>
          Task.create({
            name: t.name,
            fields: JSON.stringify(t.fields),
            dueDate: t.dueDate.toISOString(),
          }),
        ),
      });

      return listTasksResponse;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  @GrpcMethod('TaskService')
  async CreateTask(request: CreateTaskRequest): Promise<Task> {
    try {
      const nTask = {
        name: request.task.name,
        fields: request.task.fields && JSON.parse(request.task.fields),
        dueDate: new Date(request.task.dueDate),
      };
      console.log('Creating task', { nTask });
      if (!nTask.name)
        throw new RpcException({
          message: 'No name provided',
          code: HttpStatus.BAD_REQUEST,
          status: status.INVALID_ARGUMENT,
        });
      const task = await this.taskService.create(nTask);
      const pbTask = Task.create({
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: task.dueDate.toISOString(),
      });

      this.eventEmitter.emit('task.created', {
        eventType: 'create',
        pbTask,
      });

      return pbTask;
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  async UpdateTask(request: UpdateTaskRequest): Promise<Task> {
    try {
      const nTask = {
        fields: request.task.fields && JSON.parse(request.task.fields),
        dueDate: new Date(request.task.dueDate),
      };

      const task = await this.taskService.updateTask(
        { name: request.task.name },
        nTask,
      );
      const pbTask = Task.create({
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: task.dueDate.toISOString(),
      });

      this.eventEmitter.emit('task.updated', {
        eventType: 'update',
        pbTask,
      });

      return pbTask;
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  async DeleteTask(request: DeleteTaskRequest): Promise<Task> {
    try {
      const task = await this.taskService.deleteTask(request.name);
      const pbTask = Task.create({
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: task.dueDate.toISOString(),
      });

      this.eventEmitter.emit('task.deleted', {
        eventType: 'delete',
        pbTask,
      });

      return pbTask;
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  StreamTasks(request: StreamTasksRequest): Observable<StreamTasksResponse> {
    try {
      const stream$ = new Subject<StreamTasksResponse>();
      this.eventEmitter.on('task.*', (payload) => {
        console.log({ payload });
        stream$.next(
          StreamTasksResponse.create({
            eventType: payload.eventType,
            task: payload.pbTask,
          }),
        );
      });

      return stream$.asObservable();
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
