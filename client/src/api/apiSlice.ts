import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../features/auth/authTypes";
import type { RootState } from "../app/store";
import type { Category, CategoryInput, RegisterInput } from "./apiTypes";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api",

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Profile", "Item", "Category", "Favorite", "Comment"],

  endpoints: (builder) => ({
    // Authorization
    getProfile: builder.query<AuthUser, void>({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),

    grantAdminRole: builder.mutation<AuthUser, string>({
      query: (id) => ({
        url: `/auth/users/${id}/grant-admin`,
        method: "PATCH",
      }),
      invalidatesTags: ["Profile"],
    }),

    // Categories
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),

    getCategory: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation<Category, CategoryInput>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: string; body: Partial<CategoryInput> }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Category", "Item", "Favorite"],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Item", "Favorite"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGrantAdminRoleMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = apiSlice;
