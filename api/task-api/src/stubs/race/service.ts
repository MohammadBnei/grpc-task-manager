/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import {
  CreateRaceRequest,
  CreateRaceResponse,
  DeleteRaceRequest,
  DeleteRaceResponse,
  GetRaceRequest,
  GetRaceResponse,
  ListRacesRequest,
  ListRacesResponse,
  UpdateRaceRequest,
  UpdateRaceResponse,
} from "./request";

export const protobufPackage = "race";

export const RACE_PACKAGE_NAME = "race";

export interface RaceServiceClient {
  listRaces(request: ListRacesRequest, metadata?: Metadata): Observable<ListRacesResponse>;

  getRace(request: GetRaceRequest, metadata?: Metadata): Observable<GetRaceResponse>;

  createRace(request: CreateRaceRequest, metadata?: Metadata): Observable<CreateRaceResponse>;

  updateRace(request: UpdateRaceRequest, metadata?: Metadata): Observable<UpdateRaceResponse>;

  deleteRace(request: DeleteRaceRequest, metadata?: Metadata): Observable<DeleteRaceResponse>;
}

export interface RaceServiceController {
  listRaces(
    request: ListRacesRequest,
    metadata?: Metadata,
  ): Promise<ListRacesResponse> | Observable<ListRacesResponse> | ListRacesResponse;

  getRace(
    request: GetRaceRequest,
    metadata?: Metadata,
  ): Promise<GetRaceResponse> | Observable<GetRaceResponse> | GetRaceResponse;

  createRace(
    request: CreateRaceRequest,
    metadata?: Metadata,
  ): Promise<CreateRaceResponse> | Observable<CreateRaceResponse> | CreateRaceResponse;

  updateRace(
    request: UpdateRaceRequest,
    metadata?: Metadata,
  ): Promise<UpdateRaceResponse> | Observable<UpdateRaceResponse> | UpdateRaceResponse;

  deleteRace(
    request: DeleteRaceRequest,
    metadata?: Metadata,
  ): Promise<DeleteRaceResponse> | Observable<DeleteRaceResponse> | DeleteRaceResponse;
}

export function RaceServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["listRaces", "getRace", "createRace", "updateRace", "deleteRace"];
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

export const RACE_SERVICE_NAME = "RaceService";
