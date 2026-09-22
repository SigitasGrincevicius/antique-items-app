import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthSession, AuthState, LoginCredentials } from "./authTypes";
import { loginRequest } from "./authApi";

const initialState: AuthState = {
  accessToken: null,
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<
  AuthSession,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue, signal }) => {
  try {
    return await loginRequest(credentials, signal);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.accessToken = null;
        state.user = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.accessToken = null;
        state.user = null;
        state.error = action.payload ?? "Unable to log in.";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
