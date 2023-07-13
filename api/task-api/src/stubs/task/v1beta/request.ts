/* eslint-disable */
import { EventType, FieldType, Task } from "./message";

export const protobufPackage = "task.v1beta";

export interface AddFieldRequest {
  taskName?: string;
  fieldName?: string;
  fieldValue?: string;
  fieldType?: FieldType;
}

export interface AddFieldResponse {
  task?: Task;
}

export interface UpdateDateRequest {
  taskName?: string;
  dueDate?: string;
}

export interface UpdateDateResponse {
  task?: Task;
}

export interface RemoveFieldRequest {
  taskName?: string;
  fieldName?: string;
}

export interface RemoveFieldResponse {
  task?: Task;
}

export interface UsingRequest {
  username?: string;
  taskName?: string;
  eventType?: EventType;
}

export interface UsingResponse {
  username?: string;
  taskName?: string;
  eventType?: EventType;
}

export interface UsingStreamRequest {
}

export interface UsingStreamResponse {
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

export interface GetTaskResponse {
  task?: Task;
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

export interface CreateTaskResponse {
  task?: Task;
}

export interface UpdateTaskRequest {
  /** The Task resource which replaces the resource on the server. */
  task?: Task;
}

export interface UpdateTaskResponse {
  task?: Task;
}

export interface DeleteTaskRequest {
  /** The resource name of the Task to be deleted. */
  name?: string;
}

export interface DeleteTaskResponse {
  task?: Task;
}

export const TASK_V1BETA_PACKAGE_NAME = "task.v1beta";
