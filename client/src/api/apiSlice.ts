import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { AuthUser } from "../features/auth/authTypes";
import { store, type RootState } from "../app/store";
import type {
  AntiqueItem,
  AntiqueItemFilters,
  Category,
  CategoryInput,
  CreateCommentInput,
  CreateAntiqueItemInput,
  ItemComment,
  PaginationResponse,
  UpdateAntiqueItemInput,
} from "./apiTypes";
import { logout } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Central 401 handling: an expired/invalid token clears the session
// and cached API data, which triggers the redirect to /login.
const baseQueryWithSessionExpiry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    store.dispatch(logout());
    store.dispatch(apiSlice.util.resetApiState());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithSessionExpiry,

  tagTypes: ["Profile", "AntiqueItem", "Category", "Favorite", "Comment"],

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

    // Antique Items
    getAntiqueItems: builder.query<
      PaginationResponse<AntiqueItem>,
      AntiqueItemFilters | void
    >({
      query: (filters) => {
        const { categories, ...params } = filters ?? {};

        return {
          url: "/antique-items",
          params: {
            ...params,
            categories: categories?.length ? categories.join(",") : undefined,
          },
        };
      },
      providesTags: ["AntiqueItem"],
    }),

    getAntiqueItem: builder.query<AntiqueItem, string>({
      query: (id) => `/antique-items/${id}`,
      providesTags: ["AntiqueItem"],
    }),

    createAntiqueItem: builder.mutation<AntiqueItem, CreateAntiqueItemInput>({
      query: (body) => ({
        url: "/antique-items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AntiqueItem"],
    }),

    updateAntiqueItem: builder.mutation<
      AntiqueItem,
      { id: string; changes: UpdateAntiqueItemInput }
    >({
      query: ({ id, changes }) => ({
        url: `/antique-items/${id}`,
        method: "PATCH",
        body: changes,
      }),
      invalidatesTags: ["AntiqueItem", "Favorite"],
    }),

    deleteAntiqueItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/antique-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AntiqueItem", "Favorite", "Comment"],
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
      invalidatesTags: ["Category", "AntiqueItem", "Favorite"],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "AntiqueItem", "Favorite"],
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
      { itemId: string; commentId: string; content: string }
    >({
      query: ({ commentId, content }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Comment", id: itemId },
      ],
    }),

    deleteComment: builder.mutation<
      void,
      { itemId: string; commentId: string }
    >({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "Comment", id: itemId },
      ],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGrantAdminRoleMutation,
  useGetAntiqueItemsQuery,
  useGetAntiqueItemQuery,
  useCreateAntiqueItemMutation,
  useUpdateAntiqueItemMutation,
  useDeleteAntiqueItemMutation,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = apiSlice;
