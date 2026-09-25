import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import type { AuthSession, AuthState } from "../features/auth/authTypes";

const STORAGE_KEY = "auth";

function restoreAuth(): AuthState {
  const emptyState: AuthState = {
    accessToken: null,
    user: null,
    status: "idle",
    error: null,
  };

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyState;

    const session = JSON.parse(saved) as AuthSession;

    if (
      typeof session.accessToken !== "string" ||
      !session.accessToken ||
      !session.user ||
      typeof session.user.id !== "string" ||
      typeof session.user.name !== "string" ||
      typeof session.user.email !== "string" ||
      !Array.isArray(session.user.roles) ||
      !session.user.roles.every((role) => role === "user" || role === "admin")
    ) {
      return emptyState;
    }

    return {
      ...emptyState,
      accessToken: session.accessToken,
      user: session.user,
      status: "succeeded",
    };
  } catch {
    return emptyState;
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: restoreAuth(),
  },
});

store.subscribe(() => {
  const { accessToken, user } = store.getState().auth;

  try {
    if (accessToken && user) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accessToken, user }),
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Keep Redux authentication working if storage is unavailable.
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 2012 09 23
