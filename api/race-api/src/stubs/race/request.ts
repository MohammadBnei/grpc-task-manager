/* eslint-disable */
import { Race } from "./message";

export const protobufPackage = "race";

export interface ListRacesRequest {
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
  id?: string | undefined;
  name?: string | undefined;
}

export interface GetRaceResponse {
  race?: Race | undefined;
}

export interface CreateRaceRequest {
  name?: string | undefined;
  date?: string | undefined;
}

export interface CreateRaceResponse {
  race?: Race | undefined;
}

export interface UpdateRaceRequest {
  /** The Race resource which replaces the resource on the server. */
  id?: string | undefined;
  name?: string | undefined;
  date?: string | undefined;
}

export interface UpdateRaceResponse {
  race?: Race | undefined;
}

export interface DeleteRaceRequest {
  /** The resource name of the Race to be deleted. */
  id?: string | undefined;
}

export interface DeleteRaceResponse {
  race?: Race | undefined;
}

export interface SubscribeRaceParticipationRequest {
  id?: string | undefined;
  userId?: string | undefined;
  carId?: string | undefined;
}

export interface SubscribeRaceParticipationResponse {
  race?: Race | undefined;
}

export interface UnSubscribeRaceParticipationRequest {
  id?: string | undefined;
  userId?: string | undefined;
}

export interface UnSubscribeRaceParticipationResponse {
  race?: Race | undefined;
}

export const RACE_PACKAGE_NAME = "race";
