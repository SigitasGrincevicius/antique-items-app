import type { RegisterInput } from "../../api/apiTypes";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "./authTypes";

export async function loginRequest(
  credentials: LoginCredentials,
  signal?: AbortSignal,
): Promise<AuthSession> {
  const loginResponse = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    signal,
  });

  if (!loginResponse.ok) {
    throw new Error(await getErrorMessage(loginResponse, "Unable to log in."));
  }

  const { accessToken }: LoginResponse = await loginResponse.json();

  const profileResponse = await fetch("/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  });

  if (!profileResponse.ok) {
    throw new Error(
      await getErrorMessage(profileResponse, "Unable to load your profile."),
    );
  }

  const user: AuthUser = await profileResponse.json();

  return { accessToken, user };
}

export async function registerRequest(
  input: RegisterInput,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Unable to create your account."),
    );
  }
}
