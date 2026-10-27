export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;

    if (typeof data === "object" && data !== null && "message" in data) {
      const message = data.message;

      if (typeof message === "string") return message;

      if (Array.isArray(message)) {
        return message.join(", ");
      }
    }
  }

  return fallback;
}
