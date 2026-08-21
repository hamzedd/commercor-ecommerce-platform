export type AdminNotificationHandler = {
  error: (description: string) => unknown;
};

let registration:
  | { token: symbol; handler: AdminNotificationHandler }
  | undefined;

export function registerAdminNotificationHandler(
  handler: AdminNotificationHandler,
) {
  const token = Symbol("admin-notification-handler");
  registration = { token, handler };
  return () => {
    if (registration?.token === token) registration = undefined;
  };
}

export function reportAdminApiError(description: string) {
  try {
    const result = registration?.handler.error(description);
    if (result && typeof result === "object" && "then" in result) {
      void Promise.resolve(result).catch(() => undefined);
    }
  } catch {
    // A notification failure must never replace the original API error.
  }
}
