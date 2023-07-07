/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "timesheet.v1alpha";

export interface Timesheet {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  location: string;
}

export interface GetRequest {
  title: string;
  id: string;
}

export interface GetResponse {
  times: Timesheet[];
}

export interface AddRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}

export interface AddResponse {
  time: Timesheet | undefined;
}

export interface UpdateRequest {
  id: string;
  time: Timesheet | undefined;
}

export interface UpdateResponse {
  time: Timesheet | undefined;
}

export interface DeleteRequest {
  id: string;
}

export interface DeleteResponse {
  time: Timesheet | undefined;
}

export const TIMESHEET_V1ALPHA_PACKAGE_NAME = "timesheet.v1alpha";

export interface TimesheetCRUDServiceClient {
  get(request: GetRequest, metadata?: Metadata): Observable<GetResponse>;

  add(request: AddRequest, metadata?: Metadata): Observable<AddResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;
}

export interface TimesheetCRUDServiceController {
  get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> | Observable<GetResponse> | GetResponse;

  add(request: AddRequest, metadata?: Metadata): Promise<AddResponse> | Observable<AddResponse> | AddResponse;

  update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> | Observable<UpdateResponse> | UpdateResponse;

  delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;
}

export function TimesheetCRUDServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["get", "add", "update", "delete"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TimesheetCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TimesheetCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TIMESHEET_CR_UD_SERVICE_NAME = "TimesheetCRUDService";
