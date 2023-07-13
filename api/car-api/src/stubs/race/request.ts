/* eslint-disable */
import { Race } from "./message";

export const protobufPackage = "race";

export interface ListRacesRequest {
  /** The parent resource name, for example, "shelves/shelf1" */
  parent?:
    | string
    | undefined;
  /** The maximum number of items to return. */
  pageSize?:
    | number
    | undefined;
  /** The next_page_token value returned from a previous List request, if any. */
  pageToken?: string | undefined;
}

export interface ListRacesResponse {
  /**
   * The field name should match the noun "Race" in the method name.
   * There will be a maximum number of items returned based on the page_size field in the request.
   */
  races?:
    | Race[]
    | undefined;
  /** Token to retrieve the next page of results, or empty if there are no more results in the list. */
  nextPageToken?: string | undefined;
}

export interface GetRaceRequest {
  /** The field will contain name of the resource requested. */
  name?: string | undefined;
}

export interface GetRaceResponse {
  race?: Race | undefined;
}

export interface CreateRaceRequest {
  /** The parent resource name where the Race is to be created. */
  parent?:
    | string
    | undefined;
  /** The Race id to use for this Race. */
  raceId?:
    | string
    | undefined;
  /**
   * The Race resource to create.
   * The field name should match the Noun in the method name.
   */
  race?: Race | undefined;
}

export interface CreateRaceResponse {
  race?: Race | undefined;
}

export interface UpdateRaceRequest {
  /** The Race resource which replaces the resource on the server. */
  race?: Race | undefined;
}

export interface UpdateRaceResponse {
  race?: Race | undefined;
}

export interface DeleteRaceRequest {
  /** The resource name of the Race to be deleted. */
  name?: string | undefined;
}

export interface DeleteRaceResponse {
  race?: Race | undefined;
}

export const RACE_PACKAGE_NAME = "race";
