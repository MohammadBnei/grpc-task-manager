/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "hero";

export interface Hero {
  id?: number;
  name?: string;
  power?: number;
  hp?: number;
}

export interface FightRequest {
  attackingId?: string;
  defendingId?: string;
}

export interface FightResponse {
  attacker?: Hero;
  defender?: Hero;
}

export interface GetRequest {
  id?: string;
}

export interface GetResponse {
  heroes?: Hero[];
}

export interface CreateRequest {
  power?: number;
  name?: string;
}

export interface CreateResponse {
  hero?: Hero;
}

export interface UpdateRequest {
  id?: string;
  power?: number;
  name?: string;
}

export interface UpdateResponse {
  hero?: Hero;
}

export interface DeleteRequest {
  id?: string;
}

export interface DeleteResponse {
  hero?: Hero;
}

export const HERO_PACKAGE_NAME = "hero";

export interface HeroCRUDServiceClient {
  get(request: GetRequest, metadata?: Metadata): Observable<GetResponse>;

  create(request: CreateRequest, metadata?: Metadata): Observable<CreateResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;
}

export interface HeroCRUDServiceController {
  get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> | Observable<GetResponse> | GetResponse;

  create(
    request: CreateRequest,
    metadata?: Metadata,
  ): Promise<CreateResponse> | Observable<CreateResponse> | CreateResponse;

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
    const grpcMethods: string[] = ["get", "create", "update", "delete"];
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

export interface FightServiceClient {
  fight(request: FightRequest, metadata?: Metadata): Observable<FightResponse>;
}

export interface FightServiceController {
  fight(request: FightRequest, metadata?: Metadata): Promise<FightResponse> | Observable<FightResponse> | FightResponse;
}

export function FightServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["fight"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("FightService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("FightService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const FIGHT_SERVICE_NAME = "FightService";
