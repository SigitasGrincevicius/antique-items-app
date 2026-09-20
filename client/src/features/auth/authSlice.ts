import type { Role } from "../../types";

const TOKEN_KEY = "antique.accessToken";

interface JwtPayload {
  sub: string;
  name: string;
  roles: Role[];
  exp?: number;
}

interface AuthState {
  token: string | null;
  user: JwtPayload | null;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const paddedPayload = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "=",
    );

    const decodedPayload = atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload) as JwtPayload;

    if (!parsedPayload.sub || !parsedPayload.name || !parsedPayload.roles) {
      return null;
    }

    if (parsedPayload.exp && parsedPayload.exp * 1000 <= Date.now()) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
}
