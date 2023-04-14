/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../google/protobuf/timestamp";

export const protobufPackage = "media.v1alpha";

/** Media message represents a media file associated with a Kanban card. */
export interface Media {
  id: string;
  name: string;
  type: string;
  content: Uint8Array;
  createdAt: Timestamp | undefined;
}

/** MediaRequest represents a request to create or retrieve a media file. */
export interface MediaRequest {
  id: string;
  name: string;
  type: string;
  content: Uint8Array;
}

/** MediaResponse represents a response containing a media file. */
export interface MediaResponse {
  id: string;
  name: string;
  type: string;
  content: Uint8Array;
  createdAt: Timestamp | undefined;
}

export const MEDIA_V1ALPHA_PACKAGE_NAME = "media.v1alpha";

/** MediaService is a microservice that manages media files associated with Kanban cards. */

export interface MediaServiceClient {
  /** CreateMedia creates a new media file. */

  createMedia(request: MediaRequest, metadata?: Metadata): Observable<MediaResponse>;

  /** GetMedia retrieves a media file by its ID. */

  getMedia(request: MediaRequest, metadata?: Metadata): Observable<MediaResponse>;

  /** ListMedia retrieves all media files. */

  listMedia(request: MediaRequest, metadata?: Metadata): Observable<MediaResponse>;

  /** DeleteMedia deletes a media file by its ID. */

  deleteMedia(request: MediaRequest, metadata?: Metadata): Observable<MediaResponse>;
}

/** MediaService is a microservice that manages media files associated with Kanban cards. */

export interface MediaServiceController {
  /** CreateMedia creates a new media file. */

  createMedia(
    request: MediaRequest,
    metadata?: Metadata,
  ): Promise<MediaResponse> | Observable<MediaResponse> | MediaResponse;

  /** GetMedia retrieves a media file by its ID. */

  getMedia(
    request: MediaRequest,
    metadata?: Metadata,
  ): Promise<MediaResponse> | Observable<MediaResponse> | MediaResponse;

  /** ListMedia retrieves all media files. */

  listMedia(request: MediaRequest, metadata?: Metadata): Observable<MediaResponse>;

  /** DeleteMedia deletes a media file by its ID. */

  deleteMedia(
    request: MediaRequest,
    metadata?: Metadata,
  ): Promise<MediaResponse> | Observable<MediaResponse> | MediaResponse;
}

export function MediaServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createMedia", "getMedia", "listMedia", "deleteMedia"];
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
