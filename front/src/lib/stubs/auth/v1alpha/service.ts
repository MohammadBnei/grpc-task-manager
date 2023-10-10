// @generated by protobuf-ts 2.9.1
// @generated from protobuf file "auth/v1alpha/service.proto" (package "auth.v1alpha", syntax proto3)
// tslint:disable
import { ValidateResponse } from "./message";
import { ValidateRequest } from "./message";
import { RefreshTokenResponse } from "./message";
import { RefreshTokenRequest } from "./message";
import { LoginResponse } from "./message";
import { LoginRequest } from "./message";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
/**
 * @generated ServiceType for protobuf service auth.v1alpha.AuthService
 */
export const AuthService = new ServiceType("auth.v1alpha.AuthService", [
    { name: "Login", options: {}, I: LoginRequest, O: LoginResponse },
    { name: "RefreshToken", options: {}, I: RefreshTokenRequest, O: RefreshTokenResponse },
    { name: "Validate", options: {}, I: ValidateRequest, O: ValidateResponse }
]);
