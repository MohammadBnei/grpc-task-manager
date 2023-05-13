/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "media.v1alpha";

/** Media message represents a media file associated with a Kanban card. */
export interface Media {
  name: string;
  type: string;
  link: string;
  taskId: string;
}

/** MediaRequest represents a request to create or retrieve a media file. */
export interface MediaRequest {
  name: string;
  type: string;
  link: string;
  taskId: string;
}

/** MediaResponse represents a response containing a media file. */
export interface MediaResponse {
  name: string;
  type: string;
  link: string;
  taskId: string;
}

export interface ListMediasRequest {
  taskId: string;
}

export interface ListMediasResponse {
  /**
   * The field name should match the noun "Task" in the method name.
   * There will be a maximum number of items returned based on the page_size field in the request.
   */
  medias: Media[];
}

export interface DeleteMediaRequest {
  name: string;
}

export interface DeleteMediaResponse {
  isDeleted: boolean;
}

export interface GetMediaRequest {
  name: string;
}

export interface GetMediaResponse {
  media: Media | undefined;
}

export const MEDIA_V1ALPHA_PACKAGE_NAME = "media.v1alpha";

/** MediaService is a microservice that manages media files associated with Kanban cards. */

export interface MediaServiceClient {
  /** CreateMedia creates a new media file. */

  createMedia(request: MediaRequest, metadata?: Metadata): Observable<MediaResponse>;

  /** GetMedia retrieves a media file by its ID. */

  getMedia(request: GetMediaRequest, metadata?: Metadata): Observable<GetMediaResponse>;

  /** ListMedia retrieves all media files. */

  listMediaForTask(request: ListMediasRequest, metadata?: Metadata): Observable<ListMediasResponse>;

  /** DeleteMedia deletes a media file by its ID. */

  deleteMedia(request: DeleteMediaRequest, metadata?: Metadata): Observable<DeleteMediaResponse>;
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
    request: GetMediaRequest,
    metadata?: Metadata,
  ): Promise<GetMediaResponse> | Observable<GetMediaResponse> | GetMediaResponse;

  /** ListMedia retrieves all media files. */

  listMediaForTask(
    request: ListMediasRequest,
    metadata?: Metadata,
  ): Promise<ListMediasResponse> | Observable<ListMediasResponse> | ListMediasResponse;

  /** DeleteMedia deletes a media file by its ID. */

  deleteMedia(
    request: DeleteMediaRequest,
    metadata?: Metadata,
  ): Promise<DeleteMediaResponse> | Observable<DeleteMediaResponse> | DeleteMediaResponse;
}

export function MediaServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createMedia", "getMedia", "listMediaForTask", "deleteMedia"];
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
