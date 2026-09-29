import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../features/auth/authTypes";
import type {
  AntiqueItem,
  Category,
  CategoryInput,
  CreateCommentInput,
  CreateItemInput,
  ItemComment,
  ItemsQueryParams,
  PaginationResponse,
  RegisterInput,
  UpdateItemInput,
} from "./apiTypes";

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
    // Authentication
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<AuthUser, RegisterInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

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
      { id: string; body: CategoryInput }
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

    // Antique items
    getItems: builder.query<
      PaginationResponse<AntiqueItem>,
      ItemsQueryParams | void
    >({
      query: (params) => ({
        url: "/antique-items",
        params: params
          ? {
              ...params,
              categories: params.categories?.length
                ? params.categories.join(",")
                : undefined,
            }
          : undefined,
      }),
      providesTags: ["Item"],
    }),

    getItem: builder.query<AntiqueItem, string>({
      query: (id) => `/antique-items/${id}`,
      providesTags: ["Item"],
    }),

    createItem: builder.mutation<AntiqueItem, CreateItemInput>({
      query: (body) => ({
        url: "/antique-items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Item"],
    }),

    updateItem: builder.mutation<
      AntiqueItem,
      { id: string; body: UpdateItemInput }
    >({
      query: ({ id, body }) => ({
        url: `/antique-items/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Item", "Favorite"],
    }),

    deleteItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/antique-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Item", "Favorite", "Comment"],
    }),

    // Favorites
    getFavorites: builder.query<AntiqueItem[], void>({
      query: () => "/antique-items/favorites",
      providesTags: ["Favorite"],
    }),

    addFavorite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/antique-items/${id}/favorite`,
        method: "POST",
      }),
      invalidatesTags: ["Favorite"],
    }),

    removeFavorite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/antique-items/${id}/favorite`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorite"],
    }),

    // Comments
    getComments: builder.query<ItemComment[], string>({
      query: (itemId) => `/comments/antique-items/${itemId}`,
      providesTags: (_result, _error, itemId) => [
        { type: "Comment", id: itemId },
      ],
    }),

    createComment: builder.mutation<
      ItemComment,
      { itemId: string; body: CreateCommentInput }
    >({
      query: ({ itemId, body }) => ({
        url: `/comments/antique-items/${itemId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Comment", id: itemId },
      ],
    }),

    updateComment: builder.mutation<
      ItemComment,
      { id: string; itemId: string; content: string }
    >({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Comment", id: itemId },
      ],
    }),

    deleteComment: builder.mutation<void, { id: string; itemId: string }>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Comment", id: itemId },
      ],
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
  useGetItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = apiSlice;
