import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { Role } from "../../types";

const TOKEN_KEY = "antique.accessToken";

interface JwtPayload {
  sub: string;
  name: string;
  roles: Role[];
  exp?: number;
}

export interface AuthState {
  token: string | null;
  user: JwtPayload | null;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json) as JwtPayload;
    if (parsed.exp && parsed.exp * 1000 < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function loadInitialState(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { token: null, user: null };
  const user = decodeToken(token);
  if (!user) {
    localStorage.removeItem(TOKEN_KEY);
    return { token: null, user: null };
  }
  return { token, user };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials(state, action: PayloadAction<string>) {
      const user = decodeToken(action.payload);
      state.token = user ? action.payload : null;
      state.user = user;
      if (user) localStorage.setItem(TOKEN_KEY, action.payload);
      else localStorage.removeItem(TOKEN_KEY);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token);
export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.roles?.includes(Role.ADMIN) ?? false;
