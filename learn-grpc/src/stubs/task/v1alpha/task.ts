/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "task.v1alpha";

export enum EventType {
  EVENT_TYPE_CLICK = 0,
  EVENT_TYPE_CREATE = 1,
  EVENT_TYPE_UPDATE = 2,
  EVENT_TYPE_DELETE = 3,
  UNRECOGNIZED = -1,
}

export interface Task {
  name?: string;
  fields?: string;
  dueDate?: string;
}

export interface UsageRequest {
  username?: string;
  taskName?: string;
  eventType?: EventType;
}

export interface UsageResponse {
  username?: string;
  taskName?: string;
  eventType?: EventType;
}

export interface StreamTasksRequest {
}

export interface StreamTasksResponse {
  task?: Task;
  eventType?: string;
}

export interface ListTasksRequest {
  /** The parent resource name, for example, "shelves/shelf1" */
  parent?: string;
  /** The maximum number of items to return. */
  pageSize?: number;
  /** The next_page_token value returned from a previous List request, if any. */
  pageToken?: string;
}

export interface ListTasksResponse {
  /**
   * The field name should match the noun "Task" in the method name.
   * There will be a maximum number of items returned based on the page_size field in the request.
   */
  tasks?: Task[];
  /** Token to retrieve the next page of results, or empty if there are no more results in the list. */
  nextPageToken?: string;
}

export interface GetTaskRequest {
  /** The field will contain name of the resource requested. */
  name?: string;
}

export interface CreateTaskRequest {
  /** The parent resource name where the Task is to be created. */
  parent?: string;
  /** The Task id to use for this Task. */
  taskId?: string;
  /**
   * The Task resource to create.
   * The field name should match the Noun in the method name.
   */
  task?: Task;
}

export interface UpdateTaskRequest {
  /** The Task resource which replaces the resource on the server. */
  task?: Task;
}

export interface DeleteTaskRequest {
  /** The resource name of the Task to be deleted. */
  name?: string;
}

export const TASK_V1ALPHA_PACKAGE_NAME = "task.v1alpha";

export interface TaskServiceClient {
  listTasks(request: ListTasksRequest, metadata?: Metadata): Observable<ListTasksResponse>;

  getTask(request: GetTaskRequest, metadata?: Metadata): Observable<Task>;

  createTask(request: CreateTaskRequest, metadata?: Metadata): Observable<Task>;

  updateTask(request: UpdateTaskRequest, metadata?: Metadata): Observable<Task>;

  deleteTask(request: DeleteTaskRequest, metadata?: Metadata): Observable<Task>;

  streamTasks(request: StreamTasksRequest, metadata?: Metadata): Observable<StreamTasksResponse>;
}

export interface TaskServiceController {
  listTasks(
    request: ListTasksRequest,
    metadata?: Metadata,
  ): Promise<ListTasksResponse> | Observable<ListTasksResponse> | ListTasksResponse;

  getTask(request: GetTaskRequest, metadata?: Metadata): Promise<Task> | Observable<Task> | Task;

  createTask(request: CreateTaskRequest, metadata?: Metadata): Promise<Task> | Observable<Task> | Task;

  updateTask(request: UpdateTaskRequest, metadata?: Metadata): Promise<Task> | Observable<Task> | Task;

  deleteTask(request: DeleteTaskRequest, metadata?: Metadata): Promise<Task> | Observable<Task> | Task;

  streamTasks(request: StreamTasksRequest, metadata?: Metadata): Observable<StreamTasksResponse>;
}

export function TaskServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["listTasks", "getTask", "createTask", "updateTask", "deleteTask", "streamTasks"];
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
