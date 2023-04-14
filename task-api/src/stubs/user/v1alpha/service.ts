/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import {
  CheckPasswordRequest,
  CheckPasswordResponse,
  DeleteRequest,
  DeleteResponse,
  FindRequest,
  FindResponse,
  MakeAdminRequest,
  MakeAdminResponse,
  RegisterRequest,
  RegisterResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateRequest,
  UpdateResponse,
} from "./message";

export const protobufPackage = "user.v1alpha";

export const USER_V1ALPHA_PACKAGE_NAME = "user.v1alpha";

export interface UserServiceClient {
  find(request: FindRequest, metadata?: Metadata): Observable<FindResponse>;

  checkPassword(request: CheckPasswordRequest, metadata?: Metadata): Observable<CheckPasswordResponse>;

  register(request: RegisterRequest, metadata?: Metadata): Observable<RegisterResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateResponse>;

  updatePassword(request: UpdatePasswordRequest, metadata?: Metadata): Observable<UpdatePasswordResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;

  makeAdmin(request: MakeAdminRequest, metadata?: Metadata): Observable<MakeAdminResponse>;
}

export interface UserServiceController {
  find(request: FindRequest, metadata?: Metadata): Promise<FindResponse> | Observable<FindResponse> | FindResponse;

  checkPassword(
    request: CheckPasswordRequest,
    metadata?: Metadata,
  ): Promise<CheckPasswordResponse> | Observable<CheckPasswordResponse> | CheckPasswordResponse;

  register(
    request: RegisterRequest,
    metadata?: Metadata,
  ): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> | Observable<UpdateResponse> | UpdateResponse;

  updatePassword(
    request: UpdatePasswordRequest,
    metadata?: Metadata,
  ): Promise<UpdatePasswordResponse> | Observable<UpdatePasswordResponse> | UpdatePasswordResponse;

  delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;

  makeAdmin(
    request: MakeAdminRequest,
    metadata?: Metadata,
  ): Promise<MakeAdminResponse> | Observable<MakeAdminResponse> | MakeAdminResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "find",
      "checkPassword",
      "register",
      "update",
      "updatePassword",
      "delete",
      "makeAdmin",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
