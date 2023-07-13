/* eslint-disable */
import { Car } from "./message";

export const protobufPackage = "car";

export interface ListCarsRequest {
  /** The maximum number of items to return. */
  pageSize?:
    | number
    | undefined;
  /** The next_page_token value returned from a previous List request, if any. */
  pageToken?: string | undefined;
}

export interface ListCarsResponse {
  /**
   * The field name should match the noun "Car" in the method name.
   * There will be a maximum number of items returned based on the page_size field in the request.
   */
  cars?:
    | Car[]
    | undefined;
  /** Token to retrieve the next page of results, or empty if there are no more results in the list. */
  nextPageToken?: string | undefined;
}

export interface GetCarRequest {
  /** The field will contain name of the resource requested. */
  id?: string | undefined;
}

export interface GetCarResponse {
  car?: Car | undefined;
}

export interface CreateCarRequest {
  brand?: string | undefined;
  model?: string | undefined;
}

export interface CreateCarResponse {
  car?: Car | undefined;
}

export interface UpdateCarRequest {
  carId?: string | undefined;
  brand?: string | undefined;
  model?: string | undefined;
}

export interface UpdateCarResponse {
  car?: Car | undefined;
}

export interface DeleteCarRequest {
  id?: string | undefined;
}

export interface DeleteCarResponse {
  car?: Car | undefined;
}

export const CAR_PACKAGE_NAME = "car";
