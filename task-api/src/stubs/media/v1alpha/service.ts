/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import {
  CreateMediaRequest,
  CreateMediaResponse,
  DeleteMediaRequest,
  DeleteMediaResponse,
  GetMediaRequest,
  GetMediaResponse,
  ListMediasRequest,
  ListMediasResponse,
  UpdateMediaRequest,
  UpdateMediaResponse,
} from "./message";

export const protobufPackage = "media.v1alpha";

export const MEDIA_V1ALPHA_PACKAGE_NAME = "media.v1alpha";

export interface MediaServiceClient {
  listMedias(request: ListMediasRequest, metadata?: Metadata): Observable<ListMediasResponse>;

  getMedia(request: GetMediaRequest, metadata?: Metadata): Observable<GetMediaResponse>;

  createMedia(request: CreateMediaRequest, metadata?: Metadata): Observable<CreateMediaResponse>;

  updateMedia(request: UpdateMediaRequest, metadata?: Metadata): Observable<UpdateMediaResponse>;

  deleteMedia(request: DeleteMediaRequest, metadata?: Metadata): Observable<DeleteMediaResponse>;
}

export interface MediaServiceController {
  listMedias(
    request: ListMediasRequest,
    metadata?: Metadata,
  ): Promise<ListMediasResponse> | Observable<ListMediasResponse> | ListMediasResponse;

  getMedia(
    request: GetMediaRequest,
    metadata?: Metadata,
  ): Promise<GetMediaResponse> | Observable<GetMediaResponse> | GetMediaResponse;

  createMedia(
    request: CreateMediaRequest,
    metadata?: Metadata,
  ): Promise<CreateMediaResponse> | Observable<CreateMediaResponse> | CreateMediaResponse;

  updateMedia(
    request: UpdateMediaRequest,
    metadata?: Metadata,
  ): Promise<UpdateMediaResponse> | Observable<UpdateMediaResponse> | UpdateMediaResponse;

  deleteMedia(
    request: DeleteMediaRequest,
    metadata?: Metadata,
  ): Promise<DeleteMediaResponse> | Observable<DeleteMediaResponse> | DeleteMediaResponse;
}

export function MediaServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["listMedias", "getMedia", "createMedia", "updateMedia", "deleteMedia"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MediaService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MediaService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MEDIA_SERVICE_NAME = "MediaService";
