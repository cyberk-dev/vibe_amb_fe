/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginDto {
  /** @example "user1@gmail.com" */
  username: string;
  /**
   * @minLength 6
   * @example "123qwe"
   */
  password: string;
}

export interface UserEntity {
  /** @format int64 */
  id: number;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  name: string;
  blocked: boolean;
  confirmed: boolean;
  username: string;
  walletAddress: string;
  networkId: number;
  provider: "USERNAME" | "LOCAL" | "google" | "apple" | "facebook" | "wallet";
  /** @format int64 */
  profileId: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ProfileEntity {
  /** @format date-time */
  dob: string | null;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  /** @example "1/public/myimage.png" */
  avatar: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /**
   * @format int64
   * @example 999
   */
  id: number;
  /** @example "Harry" */
  name: string;
  /** @example "Harry@gmail.com" */
  email: string | null;
  /** @example "0x1234567890123456789012345678901234567890" */
  walletAddress: string | null;
}

export interface TokenResDto {
  /** @example "jwt token" */
  jwt: string;
  /** @example "refresh token" */
  jwtRefresh: string;
  user: UserEntity;
  profile: ProfileEntity | null;
}

export interface ResetPasswordDto {
  /**
   * Currently only support email
   * @example "user1@gmail.com"
   */
  username: string;
}

export interface ConfirmResetPasswordDto {
  /**
   * Currently only support email
   * @example "user1@gmail.com"
   */
  username: string;
  /**
   * @minLength 6
   * @example "123qwe"
   */
  password: string;
  /** @example "123123" */
  code: string;
}

export interface TokenRefreshResDto {
  /** @example "jwt token" */
  jwt: string;
}

export interface RegisterDto {
  /**
   * Currently only support email
   * @example "user1@gmail.com"
   */
  username: string;
  /**
   * @minLength 6
   * @example "123qwe"
   */
  password: string;
}

export interface VerifySiweDto {
  /** SIWE message to verify */
  message: string;
  /** SIWE signature to verify */
  signature: string;
}

export interface ProfileUpdateDto {
  /** @example "Harry" */
  name?: string;
  /**
   * @format date-time
   * @example "2025-01-01"
   */
  dob?: string;
}

export interface BasePaginationEntity {
  /**
   * Current page number
   * @example 1
   */
  page: number;
  /**
   * Number of items per page
   * @example 20
   */
  perPage: number;
  /**
   * Total number of items
   * @example 100
   */
  total: number;
  /**
   * Total number of pages
   * @example 5
   */
  totalPages: number;
  /**
   * Whether there is a next page
   * @example true
   */
  hasNext: boolean;
  /**
   * Whether there is a previous page
   * @example false
   */
  hasPrev: boolean;
}

export interface TodoPaginatedResponseEntity {
  /** Array of todos */
  data: any[][];
  /** Pagination information */
  pagination: BasePaginationEntity;
}

export interface TodoEntity {
  /** @format int64 */
  id: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  title: string;
  description: string;
  status: string;
  /** @format int64 */
  profileId: number;
  profile: ProfileEntity;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
}
