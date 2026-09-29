import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../features/auth/authTypes";
import type { RootState } from "../app/store";
import type { RegisterInput } from "./apiTypes";

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
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<AuthUser, RegisterInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    getProfile: builder.query<AuthUser, void>({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),
  }),
});

export const {} = apiSlice;
