import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { TaskService } from './task.service';
import {
  CreateTaskRequest,
  GetTaskRequest,
  ListTasksRequest,
  ListTasksResponse,
  Task,
} from '@buf/bneiconseil_taskmanagerapi.grpc_node/task/v1alpha/task_pb';
import { Timestamp } from '@bufbuild/protobuf';
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @GrpcMethod('TaskService')
  async GetTask(request: GetTaskRequest): Promise<Task> {
    const name = request.name;

    try {
      const task = await this.taskService.find('', name);
      const pbTask = {
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: Timestamp.fromDate(task.dueDate),
      };

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
      console.log({ tasks });

      return {
        tasks: tasks.map((t) => ({
          name: t.name,
          fields: JSON.stringify(t.fields),
          dueDate: Timestamp.fromDate(t.dueDate),
        })),
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  @GrpcMethod('TaskService')
  async CreateTask(request: CreateTaskRequest): Promise<Task> {
    try {
      const nTask = {
        ...request.task,
        fields: JSON.parse(request.task.fields),
        dueDate: new Timestamp(request.task.dueDate).toDate(),
      };
      const task = await this.taskService.create(nTask);
      const pbTask = {
        name: task.name,
        fields: JSON.stringify(task.fields),
        dueDate: Timestamp.fromDate(task.dueDate),
      };

      return pbTask;
    } catch (error) {
      console.error(error);
      throw new RpcException(error);
    }
  }
}
