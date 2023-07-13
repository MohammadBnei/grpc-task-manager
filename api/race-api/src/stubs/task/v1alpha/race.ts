/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "race.v1alpha";

export enum EventType {
  EVENT_TYPE_CLICK = 0,
  EVENT_TYPE_CREATE = 1,
  EVENT_TYPE_UPDATE = 2,
  EVENT_TYPE_DELETE = 3,
  UNRECOGNIZED = -1,
}

export interface Race {
  name?: string;
  fields?: string;
  dueDate?: string;
}

export interface UsageRequest {
  username?: string;
  raceName?: string;
  eventType?: EventType;
}

export interface UsageResponse {
  username?: string;
  raceName?: string;
  eventType?: EventType;
}

export interface StreamRacesRequest {
}

export interface StreamRacesResponse {
  race?: Race;
  eventType?: string;
}

export interface ListRacesRequest {
  /** The parent resource name, for example, "shelves/shelf1" */
  parent?: string;
  /** The maximum number of items to return. */
  pageSize?: number;
  /** The next_page_token value returned from a previous List request, if any. */
  pageToken?: string;
}

export interface ListRacesResponse {
  /**
   * The field name should match the noun "Race" in the method name.
   * There will be a maximum number of items returned based on the page_size field in the request.
   */
  races?: Race[];
  /** Token to retrieve the next page of results, or empty if there are no more results in the list. */
  nextPageToken?: string;
}

export interface GetRaceRequest {
  /** The field will contain name of the resource requested. */
  name?: string;
}

export interface CreateRaceRequest {
  /** The parent resource name where the Race is to be created. */
  parent?: string;
  /** The Race id to use for this Race. */
  raceId?: string;
  /**
   * The Race resource to create.
   * The field name should match the Noun in the method name.
   */
  race?: Race;
}

export interface UpdateRaceRequest {
  /** The Race resource which replaces the resource on the server. */
  race?: Race;
}

export interface DeleteRaceRequest {
  /** The resource name of the Race to be deleted. */
  name?: string;
}

export const TASK_V1ALPHA_PACKAGE_NAME = "race.v1alpha";

export interface RaceServiceClient {
  listRaces(request: ListRacesRequest, metadata?: Metadata): Observable<ListRacesResponse>;

  getRace(request: GetRaceRequest, metadata?: Metadata): Observable<Race>;

  createRace(request: CreateRaceRequest, metadata?: Metadata): Observable<Race>;

  updateRace(request: UpdateRaceRequest, metadata?: Metadata): Observable<Race>;

  deleteRace(request: DeleteRaceRequest, metadata?: Metadata): Observable<Race>;

  streamRaces(request: StreamRacesRequest, metadata?: Metadata): Observable<StreamRacesResponse>;
}

export interface RaceServiceController {
  listRaces(
    request: ListRacesRequest,
    metadata?: Metadata,
  ): Promise<ListRacesResponse> | Observable<ListRacesResponse> | ListRacesResponse;

  getRace(request: GetRaceRequest, metadata?: Metadata): Promise<Race> | Observable<Race> | Race;

  createRace(request: CreateRaceRequest, metadata?: Metadata): Promise<Race> | Observable<Race> | Race;

  updateRace(request: UpdateRaceRequest, metadata?: Metadata): Promise<Race> | Observable<Race> | Race;

  deleteRace(request: DeleteRaceRequest, metadata?: Metadata): Promise<Race> | Observable<Race> | Race;

  streamRaces(request: StreamRacesRequest, metadata?: Metadata): Observable<StreamRacesResponse>;
}

export function RaceServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["listRaces", "getRace", "createRace", "updateRace", "deleteRace", "streamRaces"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("RaceService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("RaceService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TASK_SERVICE_NAME = "RaceService";

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
