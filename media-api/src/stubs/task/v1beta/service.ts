/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import {
  AddFieldRequest,
  AddFieldResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskRequest,
  DeleteTaskResponse,
  GetTaskRequest,
  GetTaskResponse,
  ListTasksRequest,
  ListTasksResponse,
  RemoveFieldRequest,
  RemoveFieldResponse,
  StreamTasksRequest,
  StreamTasksResponse,
  UpdateDateRequest,
  UpdateDateResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  UsingRequest,
  UsingResponse,
  UsingStreamRequest,
  UsingStreamResponse,
} from "./request";

export const protobufPackage = "task.v1beta";

export const TASK_V1BETA_PACKAGE_NAME = "task.v1beta";

export interface TaskServiceClient {
  listTasks(request: ListTasksRequest, metadata?: Metadata): Observable<ListTasksResponse>;

  getTask(request: GetTaskRequest, metadata?: Metadata): Observable<GetTaskResponse>;

  createTask(request: CreateTaskRequest, metadata?: Metadata): Observable<CreateTaskResponse>;

  updateTask(request: UpdateTaskRequest, metadata?: Metadata): Observable<UpdateTaskResponse>;

  deleteTask(request: DeleteTaskRequest, metadata?: Metadata): Observable<DeleteTaskResponse>;

  updateDate(request: UpdateDateRequest, metadata?: Metadata): Observable<UpdateDateResponse>;

  streamTasks(request: StreamTasksRequest, metadata?: Metadata): Observable<StreamTasksResponse>;
}

export interface TaskServiceController {
  listTasks(
    request: ListTasksRequest,
    metadata?: Metadata,
  ): Promise<ListTasksResponse> | Observable<ListTasksResponse> | ListTasksResponse;

  getTask(
    request: GetTaskRequest,
    metadata?: Metadata,
  ): Promise<GetTaskResponse> | Observable<GetTaskResponse> | GetTaskResponse;

  createTask(
    request: CreateTaskRequest,
    metadata?: Metadata,
  ): Promise<CreateTaskResponse> | Observable<CreateTaskResponse> | CreateTaskResponse;

  updateTask(
    request: UpdateTaskRequest,
    metadata?: Metadata,
  ): Promise<UpdateTaskResponse> | Observable<UpdateTaskResponse> | UpdateTaskResponse;

  deleteTask(
    request: DeleteTaskRequest,
    metadata?: Metadata,
  ): Promise<DeleteTaskResponse> | Observable<DeleteTaskResponse> | DeleteTaskResponse;

  updateDate(
    request: UpdateDateRequest,
    metadata?: Metadata,
  ): Promise<UpdateDateResponse> | Observable<UpdateDateResponse> | UpdateDateResponse;

  streamTasks(request: StreamTasksRequest, metadata?: Metadata): Observable<StreamTasksResponse>;
}

export function TaskServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "listTasks",
      "getTask",
      "createTask",
      "updateTask",
      "deleteTask",
      "updateDate",
      "streamTasks",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TaskService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TaskService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TASK_SERVICE_NAME = "TaskService";

export interface FieldServiceClient {
  addField(request: AddFieldRequest, metadata?: Metadata): Observable<AddFieldResponse>;

  removeField(request: RemoveFieldRequest, metadata?: Metadata): Observable<RemoveFieldResponse>;
}

export interface FieldServiceController {
  addField(
    request: AddFieldRequest,
    metadata?: Metadata,
  ): Promise<AddFieldResponse> | Observable<AddFieldResponse> | AddFieldResponse;

  removeField(
    request: RemoveFieldRequest,
    metadata?: Metadata,
  ): Promise<RemoveFieldResponse> | Observable<RemoveFieldResponse> | RemoveFieldResponse;
}

export function FieldServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addField", "removeField"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("FieldService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("FieldService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const FIELD_SERVICE_NAME = "FieldService";

export interface UsageServiceClient {
  using(request: UsingRequest, metadata?: Metadata): Observable<UsingResponse>;

  usingStream(request: UsingStreamRequest, metadata?: Metadata): Observable<UsingStreamResponse>;
}

export interface UsageServiceController {
  using(request: UsingRequest, metadata?: Metadata): Promise<UsingResponse> | Observable<UsingResponse> | UsingResponse;

  usingStream(request: UsingStreamRequest, metadata?: Metadata): Observable<UsingStreamResponse>;
}

export function UsageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["using", "usingStream"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UsageService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UsageService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USAGE_SERVICE_NAME = "UsageService";
