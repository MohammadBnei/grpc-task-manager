/* eslint-disable */

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
  name?: string;
  fields?: Field[];
  dueDate?: string;
  done?: boolean;
  id?: string;
}

export interface Field {
  name?: string;
  value?: string;
  type?: FieldType;
}

export const TASK_V1BETA_PACKAGE_NAME = "task.v1beta";
