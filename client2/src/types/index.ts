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

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AntiqueItem {
  id: string;
  name: string;
  origin?: string | null;
  year: number;
  /** Postgres `decimal` columns are serialized as strings. */
  priceEur: number | string;
  description?: string | null;
  categoryId: string;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  createdBy?: User | null;
}

export interface Comment {
  id: string;
  content: string;
  antiqueItemId: string;
  authorId: string;
  parentCommentId: string | null;
  author?: User;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export const ITEM_SORT_FIELDS = ["createdAt", "updatedAt", "name", "category"] as const;
export type ItemSortField = (typeof ITEM_SORT_FIELDS)[number];
export type SortOrder = "ASC" | "DESC";

export interface ItemsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: ItemSortField;
  sortOrder?: SortOrder;
}

export interface CreateItemDto {
  name: string;
  origin: string;
  year: number;
  priceEur: number;
  description?: string;
  categoryId: string;
}

/** The backend's UpdateAntiqueItemDto does not accept `description`. */
export interface UpdateItemDto {
  name?: string;
  origin?: string;
  year?: number;
  priceEur?: number;
  categoryId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

export interface CreateCommentDto {
  content: string;
  parentCommentId?: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
