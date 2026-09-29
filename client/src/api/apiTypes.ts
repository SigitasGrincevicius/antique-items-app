import type { AuthUser, LoginCredentials } from "../features/auth/authTypes";

export interface RegisterInput extends LoginCredentials {
  name: string;
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
  origin: string | null;
  year: number;
  priceEur: string | number;
  description: string | null;
  categoryId: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  createdBy?: AuthUser | null;
}

export interface AntiqueItemFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  categories?: string[];
  sortBy?: "name" | "category" | "createdAt" | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

export interface PaginationResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ItemsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  categories?: string[];
  search?: string;
  sortBy?: "name" | "category" | "createdAt" | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

export interface CreateAntiqueItemInput {
  name: string;
  origin: string;
  year: number;
  priceEur: number;
  description?: string;
  categoryId: string;
}

export type UpdateAntiqueItemInput = Partial<CreateAntiqueItemInput>;

export interface CategoryInput {
  name: string;
}

export interface ItemComment {
  id: string;
  content: string;
  antiqueItemId: string;
  authorId: string;
  parentCommentId: string | null;
  author?: AuthUser;
  replies?: ItemComment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  content: string;
  parentCommentId?: string;
}
