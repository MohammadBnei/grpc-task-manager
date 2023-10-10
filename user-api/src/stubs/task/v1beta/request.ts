/* eslint-disable */
import { EventType, FieldType, Task } from "./message";

export const protobufPackage = "task.v1beta";

export interface AddFieldRequest {
  taskName?: string | undefined;
  fieldName?: string | undefined;
  fieldValue?: string | undefined;
  fieldType?: FieldType | undefined;
}

export interface AddFieldResponse {
  task?: Task | undefined;
}

export interface UpdateDateRequest {
  taskName?: string | undefined;
  dueDate?: string | undefined;
}

export interface UpdateDateResponse {
  task?: Task | undefined;
}

export interface RemoveFieldRequest {
  taskName?: string | undefined;
  fieldName?: string | undefined;
}

export interface RemoveFieldResponse {
  task?: Task | undefined;
}

export interface UsingRequest {
  username?: string | undefined;
  taskName?: string | undefined;
  eventType?: EventType | undefined;
}

export interface UsingResponse {
  username?: string | undefined;
  taskName?: string | undefined;
  eventType?: EventType | undefined;
}

export interface UsingStreamRequest {
}

export interface UsingStreamResponse {
  username?: string | undefined;
  taskName?: string | undefined;
  eventType?: EventType | undefined;
}

export interface StreamTasksRequest {
}

export interface StreamTasksResponse {
  task?: Task | undefined;
  eventType?: string | undefined;
}

export interface ListTasksRequest {
  /** The parent resource name, for example, "shelves/shelf1" */
  parent?:
    | string
    | undefined;
  /** The maximum number of items to return. */
  pageSize?:
    | number
    | undefined;
  /** The next_page_token value returned from a previous List request, if any. */
  pageToken?: string | undefined;
}

export interface ListTasksResponse {
  /**
   * The field name should match the noun "Task" in the method name.
   * There will be a maximum number of items returned based on the page_size field in the request.
   */
  tasks?:
    | Task[]
    | undefined;
  /** Token to retrieve the next page of results, or empty if there are no more results in the list. */
  nextPageToken?: string | undefined;
}

export interface GetTaskRequest {
  /** The field will contain name of the resource requested. */
  name?: string | undefined;
}

export interface GetTaskResponse {
  task?: Task | undefined;
}

export interface CreateTaskRequest {
  /** The parent resource name where the Task is to be created. */
  parent?:
    | string
    | undefined;
  /** The Task id to use for this Task. */
  taskId?:
    | string
    | undefined;
  /**
   * The Task resource to create.
   * The field name should match the Noun in the method name.
   */
  task?: Task | undefined;
}

export interface CreateTaskResponse {
  task?: Task | undefined;
}

export interface UpdateTaskRequest {
  /** The Task resource which replaces the resource on the server. */
  task?: Task | undefined;
}

export interface UpdateTaskResponse {
  task?: Task | undefined;
}

export interface DeleteTaskRequest {
  /** The resource name of the Task to be deleted. */
  name?: string | undefined;
}

export interface DeleteTaskResponse {
  task?: Task | undefined;
}

export const TASK_V1BETA_PACKAGE_NAME = "task.v1beta";
