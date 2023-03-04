/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "task.v1beta";

export enum FieldType {
  FIELD_TYPE_STRING = 0,
  UNRECOGNIZED = -1,
}

export enum EventType {
  EVENT_TYPE_CLICK = 0,
  EVENT_TYPE_CREATE = 1,
  EVENT_TYPE_UPDATE = 2,
  EVENT_TYPE_DELETE = 3,
  UNRECOGNIZED = -1,
}

export interface Task {
  name: string;
  fields: Field[];
  dueDate: string;
  done: boolean;
}

export interface Field {
  name: string;
  value: string;
  type: FieldType;
}

export interface AddFieldRequest {
  taskName: string;
  fieldName: string;
  fieldValue: string;
  fieldType: FieldType;
}

export interface UpdateDateRequest {
  taskName: string;
  dueDate: string;
}

export interface RemoveFieldRequest {
  taskName: string;
  fieldName: string;
}

export interface UsageRequest {
  username: string;
  taskName: string;
  eventType: EventType;
}

export interface UsageResponse {
  username: string;
  taskName: string;
  eventType: EventType;
}

export interface StreamTasksRequest {
}

export interface StreamTasksResponse {
  task: Task | undefined;
  eventType: string;
}

export interface ListTasksRequest {
  /** The parent resource name, for example, "shelves/shelf1" */
  parent: string;
  /** The maximum number of items to return. */
  pageSize: number;
  /** The next_page_token value returned from a previous List request, if any. */
  pageToken: string;
}

export interface ListTasksResponse {
  /**
   * The field name should match the noun "Task" in the method name.
   * There will be a maximum number of items returned based on the page_size field in the request.
   */
  tasks: Task[];
  /** Token to retrieve the next page of results, or empty if there are no more results in the list. */
  nextPageToken: string;
}

export interface GetTaskRequest {
  /** The field will contain name of the resource requested. */
  name: string;
}

export interface TaskResponse {
  task: Task | undefined;
}

export interface CreateTaskRequest {
  /** The parent resource name where the Task is to be created. */
  parent: string;
  /** The Task id to use for this Task. */
  taskId: string;
  /**
   * The Task resource to create.
   * The field name should match the Noun in the method name.
   */
  task: Task | undefined;
}

export interface UpdateTaskRequest {
  /** The Task resource which replaces the resource on the server. */
  task: Task | undefined;
}

export interface DeleteTaskRequest {
  /** The resource name of the Task to be deleted. */
  name: string;
}

export const TASK_V1BETA_PACKAGE_NAME = "task.v1beta";

export interface TaskServiceClient {
  listTasks(request: ListTasksRequest, metadata?: Metadata): Observable<ListTasksResponse>;

  getTask(request: GetTaskRequest, metadata?: Metadata): Observable<TaskResponse>;

  createTask(request: CreateTaskRequest, metadata?: Metadata): Observable<TaskResponse>;

  updateTask(request: UpdateTaskRequest, metadata?: Metadata): Observable<TaskResponse>;

  deleteTask(request: DeleteTaskRequest, metadata?: Metadata): Observable<TaskResponse>;

  updateDate(request: UpdateDateRequest, metadata?: Metadata): Observable<TaskResponse>;

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
  ): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

  createTask(
    request: CreateTaskRequest,
    metadata?: Metadata,
  ): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

  updateTask(
    request: UpdateTaskRequest,
    metadata?: Metadata,
  ): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

  deleteTask(
    request: DeleteTaskRequest,
    metadata?: Metadata,
  ): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

  updateDate(
    request: UpdateDateRequest,
    metadata?: Metadata,
  ): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

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
  addField(request: AddFieldRequest, metadata?: Metadata): Observable<TaskResponse>;

  removeField(request: RemoveFieldRequest, metadata?: Metadata): Observable<TaskResponse>;
}

export interface FieldServiceController {
  addField(
    request: AddFieldRequest,
    metadata?: Metadata,
  ): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

  removeField(
    request: RemoveFieldRequest,
    metadata?: Metadata,
  ): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;
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
  using(request: UsageRequest, metadata?: Metadata): Observable<UsageResponse>;

  usingStream(request: UsageRequest, metadata?: Metadata): Observable<UsageResponse>;
}

export interface UsageServiceController {
  using(request: UsageRequest, metadata?: Metadata): Promise<UsageResponse> | Observable<UsageResponse> | UsageResponse;

  usingStream(request: UsageRequest, metadata?: Metadata): Observable<UsageResponse>;
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
