export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export const Role = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}
