/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "hero.v1alpha";

export interface Hero {
  name?: string;
  id?: number;
  power?: number;
  hp?: number;
}

export interface GetRequest {
  name?: string;
  id?: number;
}

export interface GetResponse {
  heroes?: Hero[];
}

export interface AddRequest {
  name?: string;
  power?: number;
}

export interface AddResponse {
  hero?: Hero;
}

export interface UpdateRequest {
  id?: number;
  name?: string;
  power?: number;
  hp?: number;
}

export interface UpdateResponse {
  hero?: Hero;
}

export interface DeleteRequest {
  id?: number;
}

export interface DeleteResponse {
  hero?: Hero;
}

export const HERO_V1ALPHA_PACKAGE_NAME = "hero.v1alpha";

export interface HeroCRUDServiceClient {
  get(request: GetRequest, metadata?: Metadata): Observable<GetResponse>;

  add(request: AddRequest, metadata?: Metadata): Observable<AddResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;
}

export interface HeroCRUDServiceController {
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

export function HeroCRUDServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["get", "add", "update", "delete"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("HeroCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("HeroCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HERO_CR_UD_SERVICE_NAME = "HeroCRUDService";
