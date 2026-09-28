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
  createdBy: AuthUser | null;
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

export interface CreateItemInput {
  name: string;
  origin: string;
  year: number;
  priceEur: number;
  description?: string;
  categoryId: string;
}

export type UpdateItemInput = Partial<CreateItemInput>;

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

export interface CreateCommentnput {
  content: string;
  parentCommentId?: string;
}
