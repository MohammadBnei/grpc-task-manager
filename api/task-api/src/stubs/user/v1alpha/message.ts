/* eslint-disable */
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "user.v1alpha";

export enum UserRole {
  USER_ROLE_BASIC = 0,
  USER_ROLE_ADMIN = 1,
  UNRECOGNIZED = -1,
}

export interface User {
  id?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  createdAt?: Timestamp | undefined;
  updatedAt?: Timestamp | undefined;
  role?: UserRole | undefined;
}

export interface RegisterRequest {
  password?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
}

export interface RegisterResponse {
  user?: User | undefined;
}

export interface UpdateRequest {
  id?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
}

export interface UpdateResponse {
  user?: User | undefined;
}

export interface DeleteRequest {
  id?: string | undefined;
}

export interface DeleteResponse {
  user?: User | undefined;
}

export interface UpdatePasswordRequest {
  id?: string | undefined;
  password?: string | undefined;
}

export interface UpdatePasswordResponse {
  user?: User | undefined;
}

export interface FindRequest {
  id?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
}

export interface FindResponse {
  user?: User[] | undefined;
}

export interface CheckPasswordRequest {
  email?: string | undefined;
  password?: string | undefined;
}

export interface CheckPasswordResponse {
  status?: CheckPasswordResponse_STATUS | undefined;
  user?: User | undefined;
}

export enum CheckPasswordResponse_STATUS {
  OK = 0,
  WRONG_PASSWORD = 1,
  NOT_FOUND = 2,
  INTERNAL = 3,
  UNRECOGNIZED = -1,
}

export interface MakeAdminRequest {
  id?: string | undefined;
  email?: string | undefined;
}

export interface MakeAdminResponse {
  user?: User | undefined;
}

export const USER_V1ALPHA_PACKAGE_NAME = "user.v1alpha";
