import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { AuthUser } from "../features/auth/authTypes";
import type { RootState } from "../app/store";

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

  endpoints: (builder) => ({
    getProfile: builder.query<AuthUser, void>({
      query: () => "/auth/profile",
    }),
  }),
});

export const {useGetProfileQuery} = apiSlice;
