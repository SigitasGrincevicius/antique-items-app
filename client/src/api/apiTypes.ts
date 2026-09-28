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
   createdby: AuthUser | null;
}