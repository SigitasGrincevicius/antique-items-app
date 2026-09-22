import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "./authTypes";

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (typeof body === "object" && body !== null && "message" in body) {
      const message = body.message;

      if (typeof message === "string") {
        return message;
      }

      if (Array.isArray(message)) {
        const messages = message.filter(
          (item): item is string => typeof item === "string",
        );

        if (messages.length > 0) {
          return messages.join(" ");
        }
      }
    }
  } catch {
    // The response might not contain JSON
  }

  return fallback;
}

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
