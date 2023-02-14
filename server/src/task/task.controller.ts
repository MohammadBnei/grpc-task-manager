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
  AddFieldRequest,
  TaskResponse,
} from '../stubs/task/v1beta/task';
import { Observable, Subject } from 'rxjs';
import { ProfanityService } from 'src/profanity/profanity.service';

@Controller('task')
export class TaskController {
  taskStream: Subject<StreamTasksResponse>;
  constructor(
    private taskService: TaskService,
    private profanityService: ProfanityService,
  ) {
    this.taskStream = new Subject<StreamTasksResponse>();
  }

  @GrpcMethod('TaskService')
  async AddField(request: AddFieldRequest): Promise<TaskResponse> {
    try {
      const { fieldName, fieldValue, taskName } = request;
      const task = await this.taskService.find('', taskName);

      this.profanityService.checkStr(fieldName, fieldValue);

      task.fields[fieldName] = fieldValue;

      const uTask = await this.taskService.updateTask({ name: taskName }, task);

      const pbTask = Task.create({
        name: uTask.name,
        fields: JSON.stringify(uTask.fields),
        dueDate: uTask.dueDate.toISOString(),
      });

      this.taskStream.next({
        eventType: 'update',
        task: pbTask,
      });

      return { task: pbTask };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  async GetTask(request: GetTaskRequest): Promise<TaskResponse> {
    const name = request.name;

    try {
      const task = await this.taskService.find('', name);

      const pbTask = Task.create({
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: task.dueDate.toISOString(),
      });

      return { task: pbTask };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
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
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  async CreateTask(request: CreateTaskRequest): Promise<TaskResponse> {
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

      this.profanityService.checkTask(nTask);

      const task = await this.taskService.create(nTask);
      const pbTask = Task.create({
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: task.dueDate.toISOString(),
      });

      this.taskStream.next({
        eventType: 'create',
        task: pbTask,
      });

      return { task: pbTask };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  async UpdateTask(request: UpdateTaskRequest): Promise<TaskResponse> {
    try {
      const nTask = {
        fields: request.task.fields && JSON.parse(request.task.fields),
        dueDate: new Date(request.task.dueDate),
      };

      this.profanityService.checkTask(nTask);

      const task = await this.taskService.updateTask(
        { name: request.task.name },
        nTask,
      );
      const pbTask = Task.create({
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: task.dueDate.toISOString(),
      });

      this.taskStream.next({
        eventType: 'update',
        task: pbTask,
      });

      return { task: pbTask };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  async DeleteTask(request: DeleteTaskRequest): Promise<TaskResponse> {
    try {
      const task = await this.taskService.deleteTask(request.name);
      const pbTask = Task.create({
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: task.dueDate.toISOString(),
      });

      this.taskStream.next({
        eventType: 'delete',
        task: pbTask,
      });

      return { task: pbTask };
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('TaskService')
  StreamTasks(request: StreamTasksRequest): Observable<StreamTasksResponse> {
    try {
      return this.taskStream.asObservable();
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
