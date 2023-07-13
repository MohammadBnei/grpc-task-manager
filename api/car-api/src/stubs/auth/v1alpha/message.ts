/* eslint-disable */
import { User, UserRole } from "../../user/v1alpha/message";

export const protobufPackage = "auth.v1alpha";

export interface LoginRequest {
  email?: string | undefined;
  password?: string | undefined;
  ip?: string | undefined;
}

export interface LoginResponse {
  refreshToken?: string | undefined;
  jwt?: string | undefined;
  status?: LoginResponse_STATUS | undefined;
  user?: User | undefined;
}

export enum LoginResponse_STATUS {
  OK = 0,
  WRONG_PASSWORD = 1,
  NOT_FOUND = 2,
  INTERNAL = 3,
  UNRECOGNIZED = -1,
}

export interface RefreshTokenRequest {
  refreshToken?: string | undefined;
  ip?: string | undefined;
}

export interface RefreshTokenResponse {
  refreshToken?: string | undefined;
  jwt?: string | undefined;
  userId?: string | undefined;
}

export interface ValidateRequest {
  /** Add role here */
  jwt?: string | undefined;
}

export interface ValidateResponse {
  ok?: boolean | undefined;
  userId?: string | undefined;
  userEmail?: string | undefined;
  userRole?: UserRole | undefined;
  internal?: boolean | undefined;
}

export const AUTH_V1ALPHA_PACKAGE_NAME = "auth.v1alpha";
