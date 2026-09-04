import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "../features/auth/authSlice";
import type {
  AntiqueItem,
  Category,
  Comment,
  CreateCommentDto,
  CreateItemDto,
  ItemsQueryParams,
  LoginDto,
  LoginResponse,
  PaginationResponse,
  RegisterDto,
  UpdateItemDto,
  User,
} from "../types";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/** Wraps the base query so an expired/invalid token logs the user out. */
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const hasToken = Boolean((api.getState() as RootState).auth.token);
  if (result.error?.status === 401 && hasToken) {
    api.dispatch(logout());
  }
  return result;
};

function buildItemsQuery(params: ItemsQueryParams): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return `/antique-items${qs ? `?${qs}` : ""}`;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Item", "Category", "Comment", "Favorite", "Profile"],
  endpoints: (builder) => ({
    // ---- Auth ------------------------------------------------------------
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<User, RegisterDto>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),
    grantAdminRole: builder.mutation<User, string>({
      query: (userId) => ({
        url: `/auth/users/${userId}/grant-admin`,
        method: "PATCH",
      }),
      invalidatesTags: ["Profile"],
    }),

    // ---- Categories ------------------------------------------------------
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),
    createCategory: builder.mutation<Category, { name: string }>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<Category, { id: string; name: string }>({
      query: ({ id, ...body }) => ({ url: `/categories/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Item", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // ---- Antique items ---------------------------------------------------
    getItems: builder.query<PaginationResponse<AntiqueItem>, ItemsQueryParams>({
      query: (params) => buildItemsQuery(params),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Item" as const, id })),
              { type: "Item" as const, id: "LIST" },
            ]
          : [{ type: "Item" as const, id: "LIST" }],
    }),
    getItem: builder.query<AntiqueItem, string>({
      query: (id) => `/antique-items/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Item", id }],
    }),
    createItem: builder.mutation<AntiqueItem, CreateItemDto>({
      query: (body) => ({ url: "/antique-items", method: "POST", body }),
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),
    updateItem: builder.mutation<AntiqueItem, { id: string; body: UpdateItemDto }>({
      query: ({ id, body }) => ({ url: `/antique-items/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Item", id },
        { type: "Item", id: "LIST" },
        "Favorite",
      ],
    }),
    deleteItem: builder.mutation<void, string>({
      query: (id) => ({ url: `/antique-items/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Item", id },
        { type: "Item", id: "LIST" },
        "Favorite",
      ],
    }),
    // ---- Favorites -------------------------------------------------------
    getFavorites: builder.query<AntiqueItem[], void>({
      query: () => "/antique-items/favorites",
      providesTags: ["Favorite"],
    }),
    addFavorite: builder.mutation<void, string>({
      query: (id) => ({ url: `/antique-items/${id}/favorite`, method: "POST" }),
      invalidatesTags: ["Favorite"],
    }),
    removeFavorite: builder.mutation<void, string>({
      query: (id) => ({ url: `/antique-items/${id}/favorite`, method: "DELETE" }),
      invalidatesTags: ["Favorite"],
    }),

    // ---- Comments --------------------------------------------------------
    getComments: builder.query<Comment[], string>({
      query: (itemId) => `/comments/antique-items/${itemId}`,
      providesTags: (_r, _e, itemId) => [{ type: "Comment", id: itemId }],
    }),
    createComment: builder.mutation<Comment, { itemId: string; body: CreateCommentDto }>({
      query: ({ itemId, body }) => ({
        url: `/comments/antique-items/${itemId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { itemId }) => [{ type: "Comment", id: itemId }],
    }),
    updateComment: builder.mutation<Comment, { id: string; itemId: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (_r, _e, { itemId }) => [{ type: "Comment", id: itemId }],
    }),
    deleteComment: builder.mutation<void, { id: string; itemId: string }>({
      query: ({ id }) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { itemId }) => [{ type: "Comment", id: itemId }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGrantAdminRoleMutation,
  useGetCategoriesQuery,
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
} = api;
